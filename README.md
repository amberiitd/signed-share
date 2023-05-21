## Inspiration

With increased competition in the generative AI domain, Deepfakes represent a significant concern in the digital age, posing challenges to privacy, security, and information integrity. By using artificial intelligence and machine learning algorithms, deepfakes can manipulate or fabricate visual and audio content to make it appear real. Furthermore, deep fakes challenge the concept of truth in digital media, and without robust countermeasures or verifiable means of content authentication, it becomes increasingly difficult to discern reality from artificiality.

This can lead to numerous problems such as misinformation and manipulation in politics, where fabricated videos can potentially sway public opinion based on falsehoods. They can also be used to create false evidence, blackmail, or even fraud, with potentially severe implications in personal life and the business world. Recently Google in their I/O event, talked about the risk of plenty of deep fakes media available over the internet and gave their solution to embed all the AI-generated media from their apps with metadata to prove they are AI-generated, but what about the authenticity of contents available all over the internet. Here we come up with SignedShare to solve this problem.

## What it does

SignedShare achieves all this by generating an immutable link of the media uploaded on Filecoin via Lighthouse, and the content creator can then share this link below the post on social media. The user coming on the post can click on this link to verify the content authenticity as the same media shared in the post is present on the filecoin storage, and it’s registered on the fevm contract.

## Steps : 
1. A content creator first logins into the SignedShare Dapp using metamask wallet over the Filecoin Hyperspace Testnet network, and then uploads the media over the filecoin storage via Lighthouse.
2. After the upload completes, Lighthouse generates the CID which the content creator signs with its metamask to get the CID of the media to be registered on the deployed fevm contract.
3. Once the signing process completes the content creator gets a verifiable link.
The content creator then creates a social media post with the same media but now puts up the verifiable link also into the post.
4. Any user coming to the post can then further click on the verifiable link on the shared post and verify the details of the media.

## Question - How this protects from DeepFakes ?

We know depending on the user activity on chain, etherscan marks the wallet addresses as potential scammers or not. Also every user have their account addresses publicly linked with their social media on which they are posting, like having it in their bio. So, let’s suppose a celebrity like Vitalik tweets an image with the verified link, everybody knows the Vitalik address and can click the verifiable link to see the media on the filecoin and is signed by Vitalik wallet. Now let a scammer downloads Vitalik’s media immediately after he tweets and then deep fakes it and does a scam post from his genuinely looking Vitalik clone Twitter account, he will not be having the verifiable link in his post. Even, if he signs from a scammer wallet, then also if a user comes to a scammer post and clicks on the link then he immediately gets to know that it’s not Vitalik’s account rather it is a scam account as the address is different.

## How we built it

We used Filecoin as the storage node via lighthouse, and the app is deployed using Spheron.

## Challenges we ran into

1. The concrete idea to come up with to detect deepfakes with the help of blockchain.
2. We tried implementing a plugin in Twitter which automatically presses on the post does the verification process in the background and tells the user on the app itself whether the post is genuine or not, but couldn’t do it due to closed source.
3. Also, the categorization of wallet addresses as a scam or not like Etherscan is currently missing on Filfox, we tried training a model on ChatGPT to get it done but since the output categorization of wallet addresses is not present, we weren’t able to produce any desired classification on it.

## Accomplishments that we're proud of

It solves the major problem of deep fakes using blockchain, which is how the blockchain could be very pivotal in this generative AI era after the inception of ChatGPT. 

## What we learned

Signing mechanism and the lighthouse access condition feature which was the best feature that we are exploring to integrate into the dapp.

## What's next for SignedShare

Develop a plugin that can be integrated into the social media apps that automatically verifies the deep fake content from on-chain data and discard the post which contains such content.
