using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using ranking_website.Models.Auth;

namespace ranking_website.Services.Auth
{
    public class DynamoDbRefreshTokenService(IAmazonDynamoDB dynamoDb) : IRefreshTokenService
    {
        private readonly IAmazonDynamoDB _dynamoDb = dynamoDb;
        private const string TableName = "RefreshTokens";

        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            var request = new GetItemRequest
            {
                TableName = TableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "Token", new AttributeValue { S = token } }
                }
            };

            var response = await _dynamoDb.GetItemAsync(request);

            if (!response.IsItemSet)
            {
                return null;
            }

            return new RefreshToken
            {
                Token = response.Item["Token"].S,
                UserId = response.Item["UserId"].S,
                CreatedAt = DateTime.Parse(response.Item["CreatedAt"].S),
                ExpiresAt = DateTime.Parse(response.Item["ExpiresAt"].S),
                LastActivityAt = DateTime.Parse(response.Item["LastActivityAt"].S),
                RevokedAt = response.Item.TryGetValue("RevokedAt", out var revokedAt)
                ? DateTime.Parse(revokedAt.S)
                : null
            };
        }

        public async Task CreateAsync(RefreshToken refreshToken)
        {
            var request = new PutItemRequest
            {
                TableName = TableName,
                Item = new Dictionary<string, AttributeValue>
                {
                    { "Token", new AttributeValue { S = refreshToken.Token } },
                    { "UserId", new AttributeValue { S = refreshToken.UserId } },
                    { "CreatedAt", new AttributeValue { S = refreshToken.CreatedAt.ToString("o") } },
                    { "ExpiresAt", new AttributeValue { S = refreshToken.ExpiresAt.ToString("o") } },
                    { "LastActivityAt", new AttributeValue { S = refreshToken.LastActivityAt.ToString("o") } }
                }
            };

            if (refreshToken.RevokedAt.HasValue)
            {
                request.Item.Add("RevokedAt", new AttributeValue { S = refreshToken.RevokedAt.Value.ToString("o") });
            }

            await _dynamoDb.PutItemAsync(request);
        }

        public async Task UpdateAsync(RefreshToken refreshToken)
        {
            var updateExpression = new List<string>();
            var expressionAttributeValues = new Dictionary<string, AttributeValue>();
            var expressionAttributeNames = new Dictionary<string, string>();

            // Always update LastActivityAt
            updateExpression.Add("#lastActivity = :lastActivity");
            expressionAttributeNames["#lastActivity"] = "LastActivityAt";
            expressionAttributeValues[":lastActivity"] = new AttributeValue { S = refreshToken.LastActivityAt.ToString("o") };

            // Update RevokedAt if present
            if (refreshToken.RevokedAt.HasValue)
            {
                updateExpression.Add("#revokedAt = :revokedAt");
                expressionAttributeNames["#revokedAt"] = "RevokedAt";
                expressionAttributeValues[":revokedAt"] = new AttributeValue { S = refreshToken.RevokedAt.Value.ToString("o") };
            }

            var updateRequest = new UpdateItemRequest
            {
                TableName = TableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "Token", new AttributeValue { S = refreshToken.Token } }
                },
                UpdateExpression = "SET " + string.Join(", ", updateExpression),
                ExpressionAttributeNames = expressionAttributeNames,
                ExpressionAttributeValues = expressionAttributeValues
            };

            await _dynamoDb.UpdateItemAsync(updateRequest);
        }

        public async Task RevokeAsync(string token)
        {
            var refreshToken = await GetByTokenAsync(token);
            if (refreshToken != null)
            {
                refreshToken.RevokedAt = DateTime.UtcNow;
                await UpdateAsync(refreshToken);
            }
        }

        public async Task RevokeAllForUserAsync(string userId)
        {
            // Query using GSI (Global Secondary Index) on UserId
            var queryRequest = new QueryRequest
            {
                TableName = TableName,
                IndexName = "UserId-index",
                KeyConditionExpression = "UserId = :userId",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>
                {
                    { ":userId", new AttributeValue { S = userId } }
                }
            };

            var response = await _dynamoDb.QueryAsync(queryRequest);

            foreach (var item in response.Items)
            {
                var token = new RefreshToken
                {
                    Token = item["Token"].S,
                    UserId = item["UserId"].S,
                    CreatedAt = DateTime.Parse(item["CreatedAt"].S),
                    ExpiresAt = DateTime.Parse(item["ExpiresAt"].S),
                    LastActivityAt = DateTime.Parse(item["LastActivityAt"].S),
                    RevokedAt = item.TryGetValue("RevokedAt", out var revokedAt)
                    ? DateTime.Parse(revokedAt.S)
                    : null
                };

                if (token.RevokedAt == null)
                {
                    token.RevokedAt = DateTime.UtcNow;
                    await UpdateAsync(token);
                }
            }
        }
    }
}