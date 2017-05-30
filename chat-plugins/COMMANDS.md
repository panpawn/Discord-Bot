# Discord-Bot Commands
This guide is basic documentation on how to use and define a command.

Defining a command
------------------------------------------------------------------------

To define a command, you can do so in either `./chat-commands.js`, or a plugin in `./chat-plugins/`.  In that file, when defining the command, it's actually a function and you want to export it as `exports.commands`.  Here's an example of what a basic plugin with a command might look like:

```
exports.commands = {
    test: function (target, room, user) {
        Chat.send(room, "This is a test");
    },
};
```
This command would simply send "This is a test" when the `test` command is used somewhere.

Command parameters
------------------------------------------------------------------------

There are actually 5 different command parameters, which are:
- `target` - what is sent after the command
- `room` - this is actually `message.channel` (from bot.js)
- `user` - this is actually `message.author` (from bot.js)
- `cmd` - the exact command the user did (not case-sensitive)
- `trigger` - the command character (`Config.cmdchar`)

Functions
------------------------------------------------------------------------

- `Chat.send(room, 'Text')` - if this were in a command, this would translate to: `message.channel.send('```' + 'Text' + '```')`.  `Chat#send` is just a cleaner version.
- `Chat.toId('T E x T !! !')` - returns the ID (no spaces, capitals, or symbols) of the text passed (in this case, `text`).

Patching in a command
------------------------------------------------------------------------

Commands in both `./chat-commands.js` and `./chat-plugins/` can be patched in via the `reload` command.

If the patch fails, then a restart might be required once the issue is corrected.
