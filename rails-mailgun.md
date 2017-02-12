Rails Email Deliverability Tips 'n' Tricks with Mailgun
=======================================================

Even if you're hella legit about sourcing your email list, sometimes addresses expire, people close accounts, or some other tragedy befalls otherwise healthy emails.

To make sure that you reputation doesn't suffer you can use these simple tips and tricks!

Skip sending to bad addresses
-----------------------------

Add an after_action to `ActionMailer::Base` that will not perform deliveries to emails that are undeliverable.

    class ApplicationMailer < ActionMailer::Base
      after_action :check_email

      def check_email
        recipient = mail.to[0]
        mail.perform_deliveries = !Email.where(undeliverable: true).find_by_email(recipient)
      end
    end

In this example we have an `Email` model with `email` and `undeliverable` columns. We simply check that the recipient is deliverable after we've populated the mail object's data, but before we actually send the email. We can manually update this table as we get information about undeliverable addresses and bounces from Mailgun.

Update bad Addresses
--------------------

A great place to get your list of bounced addresses is straight from the [Mailgun API](https://documentation.mailgun.com/api-suppressions.html#bounces)

    curl -s --user 'api:key-yourapikey' -G   https://api.mailgun.net/v3/your.domain/bounces?limit=10000 > bounces.json

Be sure to put in your actual api key and domain. I've set the limit here to 10k which is the maximum. If you have more than that you'll need to page through.

Once you have this list you can update your `emails` table with the info.

Track Bounces as the Occur via Webhooks
---------------------------------------

Updating your table with any bounced addresses in bulk is a great way to prune out bad addresses and keep your reputation intact. Even better is update the table as they occur. Thankfully Mailgun provides a webhook to [track bounces](https://documentation.mailgun.com/user_manual.html#tracking-bounces).

We can create a controller to receive the event, being sure to check that the signature matches.

    class MailgunController < ApplicationController
      skip_before_action :verify_authenticity_token

      before_action :verify_mailgun_signature

      def bounced
        Email.mark_undeliverable(params[:recipient])
      end

      private

      def verify_mailgun_signature
        api_key = ENV["MAILGUN_API_KEY"]
        token = params[:token]
        timestamp = params[:timestamp]
        signature = params[:signature]

        digest = OpenSSL::Digest::SHA256.new
        data = [timestamp, token].join

        valid_signature = signature == OpenSSL::HMAC.hexdigest(digest, api_key, data)

        unless valid_signature
          render nothing: true, status: :unauthorized
        end
      end
    end

When we receive the webhook we verify the signature, return 406 unuathorized if it doesn't match. If it does match then we can be sure that the request came from Mailgun so we can mark the address as undeliverable.

Conclusion
----------

Hopefully this saves you some time when keeping your mailing list clean, peace!
