using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using ranking_website.Models;

namespace ranking_website.Services
{
    public interface IListService
    {
        Task<List<ListItem>> GetListItemsAsync(string listId);
        Task<ListItem> AddItemAsync(string listId, string itemName);
        Task<bool> RemoveItemAsync(string listId, string itemId);
    }

    public class DynamoDbService(IAmazonDynamoDB dynamoDb) : IListService
    {
        private readonly IAmazonDynamoDB _dynamoDb = dynamoDb;
        private const string TableName = "ListItems";

        public async Task<List<ListItem>> GetListItemsAsync(string listId)
        {
            var request = new QueryRequest
            {
                TableName = TableName,
                KeyConditionExpression = "ListId = :listId",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>
                {
                    { ":listId", new AttributeValue { S = listId } }
                }
            };

            var response = await _dynamoDb.QueryAsync(request);

            return [.. response.Items.Select(item => new ListItem
            {
                ListId = item["ListId"].S,
                ItemId = item["ItemId"].S,
                ItemName = item["ItemName"].S,
                CreatedAt = DateTime.Parse(item["CreatedAt"].S)
            })];
        }

        public async Task<ListItem> AddItemAsync(string listId, string itemName)
        {
            var item = new ListItem
            {
                ListId = listId,
                ItemId = Guid.NewGuid().ToString(),
                ItemName = itemName,
                CreatedAt = DateTime.UtcNow
            };

            var request = new PutItemRequest
            {
                TableName = TableName,
                Item = new Dictionary<string, AttributeValue>
                {
                    { "ListId", new AttributeValue { S = item.ListId } },
                    { "ItemId", new AttributeValue { S = item.ItemId } },
                    { "ItemName", new AttributeValue { S = item.ItemName } },
                    { "CreatedAt", new AttributeValue { S = item.CreatedAt.ToString("o") } }
                }
            };

            await _dynamoDb.PutItemAsync(request);
            return item;
        }

        public async Task<bool> RemoveItemAsync(string listId, string itemId)
        {
            var request = new DeleteItemRequest
            {
                TableName = TableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "ListId", new AttributeValue { S = listId } },
                    { "ItemId", new AttributeValue { S = itemId } }
                }
            };

            var response = await _dynamoDb.DeleteItemAsync(request);
            return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
        }
    }
}