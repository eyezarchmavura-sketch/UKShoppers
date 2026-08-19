# WhatsApp Business Integration Notes

The direct WhatsApp Business route is deferred pending the owner’s Meta configuration. The planned integration must use a permanent system-user access token, a WhatsApp Business phone-number ID, a webhook verification token, and the Meta app secret, all stored as project secrets rather than in source control.

Meta’s current Cloud API documentation confirms that the platform can send messages and receive delivery-status webhooks. A production setup needs a configured webhook endpoint, and outbound messages sent outside an active customer-service window require an approved template.

## References

1. [WhatsApp Cloud API Get Started — Meta for Developers](https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started)
2. [WhatsApp Business Platform Webhooks — Meta for Developers](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview)
3. [WhatsApp Template Fundamentals — Meta for Developers](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview)
