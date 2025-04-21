from textblob import TextBlob

def test_message(message):
    blob = TextBlob(message)
    print(f"\nTesting message: '{message}'")
    print(f"Sentiment polarity: {blob.sentiment.polarity}")
    print(f"Sentiment subjectivity: {blob.sentiment.subjectivity}")
    print(f"Noun phrases: {blob.noun_phrases}")
    print(f"Part of speech tags: {blob.tags}")

# Test different types of messages
print("\n=== POSITIVE MESSAGES ===")
test_message("I feel happy and safe today")
test_message("I'm doing great and everything is wonderful")
test_message("This is the best day of my life")

print("\n=== NEGATIVE/EMERGENCY MESSAGES ===")
test_message("I am scared and need help immediately")
test_message("Someone is threatening me and I'm in danger")
test_message("I'm being abused and need to get out now")

print("\n=== CONCERN MESSAGES ===")
test_message("I'm worried about my safety")
test_message("I feel uncomfortable in this situation")
test_message("Something doesn't feel right")

print("\n=== NEUTRAL MESSAGES ===")
test_message("The weather is nice today")
test_message("I had lunch with a friend")
test_message("I went to the store")

print("\n=== MIXED EMOTION MESSAGES ===")
test_message("I'm happy but also a bit scared")
test_message("Everything is fine, but I'm still worried")
test_message("I feel safe but need to talk about something") 