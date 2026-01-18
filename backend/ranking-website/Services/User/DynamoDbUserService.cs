using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using ranking_website.Models.User;

namespace ranking_website.Services.User
{
    public class DynamoDbUserService(IAmazonDynamoDB dynamoDb) : IUserService
    {
        private readonly IAmazonDynamoDB _dynamoDb = dynamoDb;
        private const string UsersTableName = "Users";

        public async Task<Models.User.User?> GetUserByIdAsync(string userId)
        {
            var request = new GetItemRequest
            {
                TableName = UsersTableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "Id", new AttributeValue { S = userId } }
                }
            };

            var response = await _dynamoDb.GetItemAsync(request);

            if (!response.IsItemSet)
            {
                return null;
            }

            return new Models.User.User
            {
                Id = response.Item["Id"].S,
                UserName = response.Item["UserName"].S,
                Email = response.Item.TryGetValue("Email", out var email) ? email.S : null,
                AvatarUrl = response.Item.TryGetValue("AvatarUrl", out var avatar) ? avatar.S : null,
                CreatedAt = DateTime.Parse(response.Item["CreatedAt"].S)
            };
        }

        public async Task<Models.User.User> CreateUserAsync(CreateUserRequest request)
        {
            var user = new Models.User.User
            {
                Id = request.Id, // This comes from Google's Subject ID
                UserName = request.UserName,
                Email = request.Email,
                CreatedAt = DateTime.UtcNow
            };

            var dynamoRequest = new PutItemRequest
            {
                TableName = UsersTableName,
                Item = new Dictionary<string, AttributeValue>
                {
                    { "Id", new AttributeValue { S = user.Id } },
                    { "UserName", new AttributeValue { S = user.UserName } },
                    { "CreatedAt", new AttributeValue { S = user.CreatedAt.ToString("o") } }
                }
            };

            if (!string.IsNullOrEmpty(user.Email))
            {
                dynamoRequest.Item.Add("Email", new AttributeValue { S = user.Email });
            }

            await _dynamoDb.PutItemAsync(dynamoRequest);
            return user;
        }

        public async Task<Models.User.User?> UpdateUserAsync(string userId, UpdateUserRequest request)
        {
            var existingUser = await GetUserByIdAsync(userId);
            if (existingUser == null)
            {
                return null;
            }

            var updateExpression = new List<string>();
            var expressionAttributeValues = new Dictionary<string, AttributeValue>();
            var expressionAttributeNames = new Dictionary<string, string>();

            if (request.UserName != null)
            {
                updateExpression.Add("#username = :username");
                expressionAttributeNames["#username"] = "UserName";
                expressionAttributeValues[":username"] = new AttributeValue { S = request.UserName };
            }

            if (request.AvatarUrl != null)
            {
                updateExpression.Add("#avatar = :avatar");
                expressionAttributeNames["#avatar"] = "AvatarUrl";
                expressionAttributeValues[":avatar"] = new AttributeValue { S = request.AvatarUrl };
            }

            if (updateExpression.Count == 0)
            {
                return existingUser;
            }

            var updateRequest = new UpdateItemRequest
            {
                TableName = UsersTableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "Id", new AttributeValue { S = userId } }
                },
                UpdateExpression = "SET " + string.Join(", ", updateExpression),
                ExpressionAttributeNames = expressionAttributeNames,
                ExpressionAttributeValues = expressionAttributeValues,
                ReturnValues = ReturnValue.ALL_NEW
            };

            var response = await _dynamoDb.UpdateItemAsync(updateRequest);

            return new Models.User.User
            {
                Id = response.Attributes["Id"].S,
                UserName = response.Attributes["UserName"].S,
                Email = response.Attributes.TryGetValue("Email", out var email) ? email.S : null,
                AvatarUrl = response.Attributes.TryGetValue("AvatarUrl", out var avatar) ? avatar.S : null,
                CreatedAt = DateTime.Parse(response.Attributes["CreatedAt"].S)
            };
        }
    }
}
