using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;

namespace ranking_website.Services.User
{
    public class DynamoDbUserService(IAmazonDynamoDB dynamoDb) : IUserService
    {
        private readonly IAmazonDynamoDB _dynamoDb = dynamoDb;
        private const string UsersTableName = "Users";
    }
}
