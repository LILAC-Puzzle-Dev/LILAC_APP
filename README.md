# LILAC APP README

***

## 1. General Information
LILAC APP is the main management tool for [LILAC Puzzle Official](https://discord.gg/ANNqeX82XR) Discord server. 
It provides many useful supervision methods to the staff team, as well as a bunch of interaction handlers and essential commands for the community.
With deep integration into the server, this APP is aware of everything happening on the server, and take the right action.  
Currently, this APP is limited to be only functional inside LILAC Puzzle Official server.
In the future it may be available to all server owners, delivering LILAC related content to their own communities.

***

## 2. Credits
### 2.1. Developers
LILAC APP is developed by **LILAC Development Team**, under the guidance of **LILAC Staff Team**.
- LILAC Development Team:
    - YC_Eagle
    - Trilleo
    - KoolShow
    - lan
    - Bulaisien
- LILAC Staff Team:
    - YC_Eagle
### 2.2. Service Providers
Discord JavaScript integration API provider: [Discord.js](https://discord.js.org/)  
Cloud database provider: [MongoDB](https://www.mongodb.com/)  
Artificial Intelligence structure provider: [OpenAI](https://openai.com/)  
Artificial Intelligence API provider: [DeepSeek](https://deepseek.com/) (deepseek-reasoner)  
Terms of Services archive server provider: [Trilleo Network](http://trilleo.net/)

***

## 3. Commands
**Important Note**  
Arguments with "< >" symbol are required. Those with "[ ]" symbol are optional.

### 3.1. Information Check
#### /credits
Usage: `/credits`  
See the credits of LILAC APP and LILAC Puzzle Official.
#### /ping
Usage: `/ping`  
See the connection status of LILAC APP (client and websocket ping).

### 3.2. Admin Only
#### /ban
Usage: `/ban <member> [reason]`  
Ban a member from the server permanently.
#### /kick
Usage: `/kick <member> [reason]`  
Kick a member from the server. They can still join again with an invitation.
#### /timeout
Usage: `/timeout <member> <duration> [reason]`  
Timeout (mute) a member for a period of time.
#### /send-message
Usage: `/send-message <channel> <message>`  
Send a message in a channel using the bot's account.
#### /edit-message
Usage: `/edit-message <channel> <message-id> <new-message>`  
Edit a message. Due to Discord's policy, you can **ONLY** edit a message that is sent by the bot.
#### /autorole-configure
Usage: `/autorole-configure <role>`  
Add a role to the Autorole group. The role will be automatically added to a user upon joining the server.
#### /autorole-disable
Usage: `/autorole-disable`  
Disable autorole function of the server.
#### /add-suggestion-channel
Usage: `/add-suggestion-channel <channel>`  
Add a channel to the Suggestion group. This channel will be used to collect members' suggestion.
#### /remove-suggestion-channel
Usage: `/remove-suggestion-channel <channel>`  
Remove a channel from the Suggestion group. Previous suggestions in this channel will **NOT** be deleted.
#### /giveaway
Usage: `/giveaway <time> <reward>`  
Set up a giveaway event for members to join.

### 3.3. Economy
#### /balance
Usage: `/balance [user]`  
Check yours/someone else's balance in the server.
#### /daily
Usage: `/daily`  
Claim your daily reward.
#### /level
Usage: `/level [member]`  
Check a member's level information.

### 3.4. Support
#### /suggest
Usage: `/suggest`  
Open a form where you can submit suggestion. Only functional in specific channels.

### 3.5. Entertainment
#### /rps
Usage: `/rps <member>`  
Challenge a member to play rock paper scissors with you.

***

## 4. Functions

*Coming soon...*

***

All the entries above are subject to change at any time, and thus will be regularly updated every so often.
You should always follow the server rules and our terms of services.

**LILAC Puzzle Official** All Rights Reserved.
