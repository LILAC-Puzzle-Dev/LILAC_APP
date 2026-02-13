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
    - Ian
    - Bulaisien
- LILAC Staff Team:
    - YC_Eagle
### 2.2. Service Providers
Discord JavaScript integration API provider: [Discord.js](https://discord.js.org/)  
Cloud database provider: [MongoDB](https://www.mongodb.com/)  
Artificial Intelligence structure provider: [OpenAI](https://openai.com/)  
Artificial Intelligence API provider: [DeepSeek](https://deepseek.com/) (deepseek-reasoner)  
Terms of Services archive server provider: [Trilleo Network](https://trilleo.net/)

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
#### /toggle-feature
Usage: `/toggle-feature <feature> <status>`  
Turn a specific bot feature on or off.
#### /add-vc-role
Usage: `/add-vc-role <role> <minutes>`  
Set a role reward for voice chat activity.
#### /manage-announcements
Usage: `/manage-announcements <action> <channel>`  
Manage which channels automatically publish news.
#### /send-json
Usage: `/send-json <channel>`  
Pop up a modal to paste JSON data and send the message.
#### /manage-buttons add
Usage: `/manage-buttons add <message_id> <row> <label> <id_or_url> <style> [emoji]`  
Add a new button to an existing bot message.
#### /manage-buttons remove
Usage: `/manage-buttons remove <message_id> <id_or_url>`  
Remove a specific button from an existing bot message.

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

### 3.6. Puzzle
#### /cryptic-create
Usage: `/cryptic-create <author> <clue> <explanation> <answer>`  
Create a new cryptic entry (@Puzzle Creator only).
#### /wotw-create
Usage: `/wotw-create <word>`  
Create a new WotW event (Admins only).
#### /wotw-disable
Usage: `/wotw-disable <gameId>`  
Disable an ongoing WotW event (Admins only).

### 3.7. Chatscore
#### /add-chatscore-role
Usage: `/add-chatscore-role <role> <threshold>`  
Add a reward role for Chatscore (Admins only).
#### /chatscore
Usage: `/chatscore [user]`  
Check your or another member's total chatscore and monthly chatscore.
#### /monthly-chatscore-leaderboard
Usage: `/monthly-chatscore-leaderboard`  
Show the top chatscore for the current month.

### 3.8. Puzzle Mastery
#### /add-puzzle-mastery-role
Usage: `/add-puzzle-mastery-role <role> <threshold>`  
Add a reward role for Puzzle Mastery (Admins only).
#### /add-puzzle-mastery-score
Usage: `/add-puzzle-mastery-score <user> <score>`  
Add Puzzle Mastery Score to a specific user (Admins only).
#### /puzzle-mastery
Usage: `/puzzle-mastery [user]`  
Check your or another member's total Puzzle Mastery Score and current role level.

### 3.9. Miscellaneous
#### /vc-time
Usage: `/vc-time [user]`  
Check your or another member's total time spent in voice channels.

***

## 4. Functions

### 4.1. Moderation Management
#### Member Message Log
Automatically log all the messages sent by members in the server.  
**Important Note**  
__This function is crucial to punishment decision. For your privacy, all the logs can only be reviewed by admins with @Sr Admin role. So feel free to engage in the community.__
#### Interaction Manager
Handle all the interactions sent to the bot (buttons, text inputs, commands, etc.) and output specific functions.
#### Event Scheduler
Perform specific events at scheduled time.

### 4.2. Community System
#### Chat Score
XP-based leveling system for the community server.
#### Puzzle Mastery
Rating system for your puzzle-solving ability.
#### VC Tracker
Tracks members' active voice chat time and provides role reward.

***

All the entries above are subject to change at any time, and thus will be regularly updated every so often.
You should always follow the server rules and our terms of services.

**LILAC Puzzle Official** All Rights Reserved.
