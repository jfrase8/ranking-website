using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using ranking_website.Models.List;
using System.Collections.Generic;

namespace ranking_website.Services.List
{
    public class DynamoDbListService(IAmazonDynamoDB dynamoDb) : IListService
    {
        private readonly IAmazonDynamoDB _dynamoDb = dynamoDb;
        private const string ListsTableName = "Lists";
        private const string ListItemsTableName = "ListItems";

        // ==================== List Operations ====================
        public async Task<List<Models.List.List?>> GetUserListsAsync(string userId)
        {
            var request = new QueryRequest
            {
                TableName = ListsTableName,
                KeyConditionExpression = "UserId = :userId",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>
                {
                    { ":userId", new AttributeValue { S = userId } }
                }
            };

            var response = await _dynamoDb.QueryAsync(request);

            return [.. response.Items.Select(item => new Models.List.List
            {
                Id = item["Id"].S,
                Name = item["Name"].S,
                UserId = item["UserId"].S,
                Description = item.TryGetValue("Description", out AttributeValue? value) ? value.S : null,
                Privacy = item["Privacy"].S,
                CreatedAt = DateTime.Parse(item["CreatedAt"].S)
            })];
        }
        public async Task<Models.List.List?> GetListAsync(string listId)
        {
            var request = new GetItemRequest
            {
                TableName = ListsTableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "Id", new AttributeValue { S = listId } }
                }
            };

            var response = await _dynamoDb.GetItemAsync(request);

            if (!response.IsItemSet)
            {
                return null;
            }

            return new Models.List.List
            {
                Id = response.Item["Id"].S,
                Name = response.Item["Name"].S,
                UserId = response.Item["UserId"].S,
                Description = response.Item.TryGetValue("Description", out AttributeValue? value) ? value.S : null,
                Privacy = response.Item["Privacy"].S,
                CreatedAt = DateTime.Parse(response.Item["CreatedAt"].S)
            };
        }

        public async Task<Models.List.List> CreateListAsync(CreateListRequest request)
        {
            var list = new Models.List.List
            {
                Id = Guid.NewGuid().ToString(),
                Name = request.Name,
                UserId = request.UserId,
                Description = request.Description,
                Privacy = request.Privacy,
                CreatedAt = DateTime.UtcNow
            };

            var dynamoRequest = new PutItemRequest
            {
                TableName = ListsTableName,
                Item = new Dictionary<string, AttributeValue>
                {
                    { "Id", new AttributeValue { S = list.Id } },
                    { "Name", new AttributeValue { S = list.Name } },
                    { "UserId", new AttributeValue { S = list.UserId } },
                    { "Privacy", new AttributeValue { S = list.Privacy } },
                    { "CreatedAt", new AttributeValue { S = list.CreatedAt.ToString("o") } }
                }
            };

            // Only add description if it is not null or empty
            if (!string.IsNullOrEmpty(list.Description))
            {
                dynamoRequest.Item.Add("Description", new AttributeValue { S = list.Description });
            }

            await _dynamoDb.PutItemAsync(dynamoRequest);
            return list;
        }

        public async Task<Models.List.List?> UpdateListAsync(string listId, UpdateListRequest request)
        {
            // First check if list exists
            var existingList = await GetListAsync(listId);
            if (existingList == null)
            {
                return null;
            }

            var updateExpression = new List<string>();
            var expressionAttributeValues = new Dictionary<string, AttributeValue>();
            var expressionAttributeNames = new Dictionary<string, string>();

            if (request.Name != null)
            {
                updateExpression.Add("#name = :name");
                expressionAttributeNames["#name"] = "Name";
                expressionAttributeValues[":name"] = new AttributeValue { S = request.Name };
            }

            if (request.Description != null)
            {
                updateExpression.Add("#desc = :desc");
                expressionAttributeNames["#desc"] = "Description";
                expressionAttributeValues[":desc"] = new AttributeValue { S = request.Description };
            }

            if (updateExpression.Count == 0)
            {
                return existingList; // Nothing to update
            }

            var updateRequest = new UpdateItemRequest
            {
                TableName = ListsTableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "Id", new AttributeValue { S = listId } }
                },
                UpdateExpression = "SET " + string.Join(", ", updateExpression),
                ExpressionAttributeNames = expressionAttributeNames,
                ExpressionAttributeValues = expressionAttributeValues,
                ReturnValues = ReturnValue.ALL_NEW
            };

            var response = await _dynamoDb.UpdateItemAsync(updateRequest);

            return new Models.List.List
            {
                Id = response.Attributes["Id"].S,
                Name = response.Attributes["Name"].S,
                UserId = response.Attributes["UserId"].S,
                Description = response.Attributes.TryGetValue("Description", out AttributeValue? value) ? value.S : null,
                Privacy = response.Attributes["Privacy"].S,
                CreatedAt = DateTime.Parse(response.Attributes["CreatedAt"].S)
            };
        }

        public async Task<bool> DeleteListAsync(string listId)
        {
            // First delete all items in the list
            var items = await GetListItemsAsync(listId);
            foreach (var item in items)
            {
                await DeleteItemAsync(listId, item.Id);
            }

            // Then delete the list itself
            var request = new DeleteItemRequest
            {
                TableName = ListsTableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "Id", new AttributeValue { S = listId } }
                }
            };

            var response = await _dynamoDb.DeleteItemAsync(request);
            return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
        }

        // ==================== List Item Operations ====================

        public async Task<List<ListItem>> GetListItemsAsync(string listId)
        {
            var request = new QueryRequest
            {
                TableName = ListItemsTableName,
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
                Id = item["Id"].S,
                Name = item["Name"].S,
                Rank = int.Parse(item["Rank"].N),
                CreatedAt = DateTime.Parse(item["CreatedAt"].S)
            })];
        }

        public async Task<ListItem> AddItemAsync(string listId, string itemName)
        {
            // Get current max rank for this list
            var existingItems = await GetListItemsAsync(listId);
            var maxRank = existingItems.Count > 0 ? existingItems.Max(i => i.Rank) : 0;

            var item = new ListItem
            {
                ListId = listId,
                Id = Guid.NewGuid().ToString(),
                Name = itemName,
                Rank = maxRank + 1,
                CreatedAt = DateTime.UtcNow
            };

            var request = new PutItemRequest
            {
                TableName = ListItemsTableName,
                Item = new Dictionary<string, AttributeValue>
                {
                    { "ListId", new AttributeValue { S = item.ListId } },
                    { "Id", new AttributeValue { S = item.Id } },
                    { "Name", new AttributeValue { S = item.Name } },
                    { "Rank", new AttributeValue { N = item.Rank.ToString() } },
                    { "CreatedAt", new AttributeValue { S = item.CreatedAt.ToString("o") } }
                }
            };

            await _dynamoDb.PutItemAsync(request);
            return item;
        }

        public async Task<List<ListItem>> UpdateItemAsync(string listId, string itemId, UpdateListItemRequest request)
        {
            var updateExpression = new List<string>();
            var expressionAttributeValues = new Dictionary<string, AttributeValue>();
            var expressionAttributeNames = new Dictionary<string, string>();

            if (request.Name != null)
            {
                updateExpression.Add("#name = :name");
                expressionAttributeNames["#name"] = "Name";
                expressionAttributeValues[":name"] = new AttributeValue { S = request.Name };
            }

            if (request.Rank.HasValue)
            {
                updateExpression.Add("#rank = :rank");
                expressionAttributeNames["#rank"] = "Rank";
                expressionAttributeValues[":rank"] = new AttributeValue { N = request.Rank.Value.ToString() };
            }

            if (updateExpression.Count == 0)
            {
                return await GetListItemsAsync(listId); // Nothing to update, return current items
            }

            var updateRequest = new UpdateItemRequest
            {
                TableName = ListItemsTableName,
                Key = new Dictionary<string, AttributeValue>
            {
                { "ListId", new AttributeValue { S = listId } },
                { "Id", new AttributeValue { S = itemId } }
            },
                UpdateExpression = "SET " + string.Join(", ", updateExpression),
                ExpressionAttributeNames = expressionAttributeNames,
                ExpressionAttributeValues = expressionAttributeValues
            };

            await _dynamoDb.UpdateItemAsync(updateRequest);

            // Return all items for the list after update
            return await GetListItemsAsync(listId);
        }

        public async Task<bool> DeleteItemAsync(string listId, string itemId)
        {
            // First, get the item being deleted to know its rank
            var allItems = await GetListItemsAsync(listId);
            var itemToDelete = allItems.FirstOrDefault(i => i.Id == itemId);

            if (itemToDelete == null)
            {
                return false; // Item not found
            }

            // Delete the item
            var deleteRequest = new DeleteItemRequest
            {
                TableName = ListItemsTableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "ListId", new AttributeValue { S = listId } },
                    { "Id", new AttributeValue { S = itemId } }
                }
            };

            var deleteResponse = await _dynamoDb.DeleteItemAsync(deleteRequest);

            if (deleteResponse.HttpStatusCode != System.Net.HttpStatusCode.OK)
            {
                return false;
            }

            // Shift ranks for all items that came after the deleted item
            var itemsToUpdate = allItems.Where(i => i.Rank > itemToDelete.Rank).ToList();

            foreach (var item in itemsToUpdate)
            {
                var updateRequest = new UpdateItemRequest
                {
                    TableName = ListItemsTableName,
                    Key = new Dictionary<string, AttributeValue>
                    {
                        { "ListId", new AttributeValue { S = listId } },
                        { "Id", new AttributeValue { S = item.Id } }
                    },
                    UpdateExpression = "SET #rank = :rank",
                    ExpressionAttributeNames = new Dictionary<string, string>
                    {
                        { "#rank", "Rank" }
                    },
                    ExpressionAttributeValues = new Dictionary<string, AttributeValue>
                    {
                        { ":rank", new AttributeValue { N = (item.Rank - 1).ToString() } }
                    }
                };

                await _dynamoDb.UpdateItemAsync(updateRequest);
            }

            return true;
        }
    }
    }