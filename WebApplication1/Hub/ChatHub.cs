using Microsoft.AspNetCore.SignalR;

namespace WebApplication1.Hubs
{
    public class ChatHub : Microsoft.AspNetCore.SignalR.Hub

    {
        private readonly IDictionary<string, Connection> _connection;
        public ChatHub(IDictionary<string, Connection> connection)
        {
            this._connection = connection;
        }

        public async Task joinInstance(Connection connection)
        {

            Console.WriteLine($"JoinInstance called. Room: {connection.room}");

            if (connection.room != null)
            {
                try
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, connection.room);
                    _connection[Context.ConnectionId] = connection;
                    await Clients.Group(connection.room).SendAsync("RecieveMessage", "Admin", $"{connection.user} has joined!", DateTime.Now);
                    await sendConnectedUser(connection.room);
                }
                catch (Exception ex)
                {
                    // Log the exception and handle it accordingly
                    Console.WriteLine($"Error while adding user to group: {ex.Message}");
                    throw; // Re-throw the exception if needed for further debugging or handling
                }
            }
            else
            {
                // Log an error or notify clients about the invalid room
                Console.WriteLine("Error: 'room' is null when trying to joinInstance.");
                // Alternatively, handle it according to your application logic
                // For instance, send an error message to the client.
                await Clients.Caller.SendAsync("JoinError", "Invalid room provided.");
            }
        }
        public async Task sendMessage(string message) { 
            if(_connection.TryGetValue(Context.ConnectionId,out Connection connection))
            {
                await Clients.Group(connection.room).SendAsync("RecieveMessage",connection.user,message,DateTime.Now);
            }
        }
        public async Task sendConnectedUser(string room)
        {
            var users = _connection.Values
                .Where(x => x.room == room)
                .Select(x => x.user)
                .ToList(); // Retrieve the list of connected users in the specified room

            await Clients.Group(room).SendAsync("ConnectedUser", users);
        }
        public override Task OnDisconnectedAsync(Exception? ex)
        {
            if (!_connection.TryGetValue(Context.ConnectionId, out Connection connection)) { 
            return base.OnDisconnectedAsync(ex);
            }
            _connection.Remove(Context.ConnectionId);
            Clients.Group(connection.room!).SendAsync("RecieveMessage", "Admin", $"{connection.user} has left!",DateTime.Now);
            sendConnectedUser(connection.room!);
            return base.OnDisconnectedAsync(ex);
        }
    }
}
