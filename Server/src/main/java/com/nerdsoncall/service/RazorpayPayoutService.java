package com.nerdsoncall.service;

import com.nerdsoncall.entity.Payout;
import com.nerdsoncall.entity.User;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayPayoutService {

    private RazorpayClient razorpayClient;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    public RazorpayPayoutService(@Value("${razorpay.key-id}") String keyId, @Value("${razorpay.key-secret}") String keySecret) throws RazorpayException {
        this.razorpayClient = new RazorpayClient(keyId, keySecret);
    }

    public String createContact(User user) throws RazorpayException {
        JSONObject contactRequest = new JSONObject();
        contactRequest.put("name", user.getFirstName() + " " + user.getLastName());
        contactRequest.put("email", user.getEmail());
        contactRequest.put("contact", user.getPhoneNumber());
        contactRequest.put("type", "tutor");
        contactRequest.put("reference_id", user.getId().toString());

        // return razorpayClient.contacts.create(contactRequest).get("id");
        return "1234567890";
    }

    public String createFundAccount(User user) throws RazorpayException {
         // This is a simplified example. In a real application, you would
         // securely collect and use the tutor's bank account details.
        JSONObject fundAccountRequest = new JSONObject();
        fundAccountRequest.put("contact_id", user.getRazorpayContactId());
        fundAccountRequest.put("account_type", "bank_account");

        JSONObject bankAccountDetails = new JSONObject();
        bankAccountDetails.put("name", user.getFirstName() + " " + user.getLastName());
        bankAccountDetails.put("ifsc", "IFSC_CODE_HERE"); // Replace with actual IFSC
        bankAccountDetails.put("account_number", "ACCOUNT_NUMBER_HERE"); // Replace with actual account number
        fundAccountRequest.put("bank_account", bankAccountDetails);

        // return razorpayClient.fundAccounts.create(fundAccountRequest).get("id");
        return "1234567890";
    }

    public String processPayout(Payout payout, String fundAccountId) throws RazorpayException {
        JSONObject payoutRequest = new JSONObject();
        payoutRequest.put("account_number", "2323230097223456"); // Your RazorpayX account number
        payoutRequest.put("fund_account_id", fundAccountId);
        payoutRequest.put("amount", (int)(payout.getAmount() * 100)); // Amount in paise
        payoutRequest.put("currency", "INR");
        payoutRequest.put("mode", "IMPS");
        payoutRequest.put("purpose", "payout");
        payoutRequest.put("queue_if_low_balance", true);
        payoutRequest.put("reference_id", "payout_for_" + payout.getId());
        payoutRequest.put("narration", "Monthly Earnings Payout");

        // return razorpayClient.payouts.create(payoutRequest).get("id");
        return "1234567890";
    }
} 