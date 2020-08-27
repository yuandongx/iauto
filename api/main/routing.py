# Released under the AGPL-3.0 License.
from channels.routing import ProtocolTypeRouter, ChannelNameRouter, URLRouter
from consumer import routing, executors

application = ProtocolTypeRouter({
    'channel': ChannelNameRouter({
        'task_runner': executors.Executor,
    }),
    'websocket': URLRouter(
        routing.websocket_urlpatterns
    )
})
