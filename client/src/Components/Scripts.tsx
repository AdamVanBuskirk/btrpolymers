import { useState } from "react";
import { useIsMobile } from "../Core/hooks";

function Scripts() {
  const [selected, setSelected] = useState<string>("PD");
  const [mode, setMode] = useState<"actions" | "calls">("calls");
  const isMobile = useIsMobile();

  const actions = [
    { key: "DYK", label: "The Did You Know Question" },
    { key: "rDYK", label: "The Reverse Did You Know Question" },
    { key: "Pivot", label: "The Pivot to the Sale" },
    { key: "Pivot-C", label: "The Pivot to the Next Conversation" },
    { key: "%Biz", label: "The Percent of Business Question" },
    { key: "iREF", label: "The Internal Referral Request" },
    { key: "xREF", label: "The External Referral Request" },
    { key: "Note", label: "Handwritten Note" },
    { key: "Comm", label: "Communicating a Testimonial" },
  ];

  const calls = [
    { key: "PD", label: "Post-Delivery" },
    { key: "OH", label: "Order History" },
    { key: "CWE", label: "Clients Who Emailed" },
    { key: "ZD30", label: "Zero Dark 30" },
    { key: "RAP", label: "Revenue Auto-Pilot" },
    { key: "DR", label: "Decreasing Revenue" },
    { key: "PC", label: "Past Customer" },
    { key: "QFU", label: "Quote F/U" },
    { key: "PQFU", label: "Pre Quote FU" },
    { key: "LC", label: "Large Clients" },
    { key: "SMC", label: "Small & Medium Clients" },
    { key: "PP", label: "Past Prospects" },
    { key: "CC", label: "Cold Calls" },
  ];

  const activeBubbles = mode === "actions" ? actions : calls;

  const handleClick = (key: string) => {
    setSelected(key);
  };

  const handleModeChange = (newMode: "actions" | "calls") => {
    setMode(newMode);

    if (newMode === "actions") {
      if (!actions.some((a) => a.key === selected)) {
        setSelected(actions[0].key);
      }
    } else {
      if (!calls.some((c) => c.key === selected)) {
        setSelected(calls[0].key);
      }
    }
  };

  return (
    <div
      className="rightContentDefault"
      style={{
        height: "calc(100vh - 53.16px)",
        display: "flex",
        flexDirection: "column",
        background: "#f9fafb",
      }}
    >
      {/* Sticky header with toggle + bubbles */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#f9fafb",
          padding: "10px 12px 8px 12px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {/* Attractive toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              borderRadius: "9999px",
              padding: "3px",
              background:
                "linear-gradient(135deg, rgba(219,53,20,0.12), rgba(15,118,110,0.12))",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <button
              onClick={() => handleModeChange("calls")}
              style={{
                border: "none",
                borderRadius: "9999px",
                padding: "6px 18px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                minWidth: "140px",
                background:
                  mode === "calls" ? "#ffffff" : "transparent",
                color:
                  mode === "calls" ? "#111827" : "#6b7280",
                boxShadow:
                  mode === "calls"
                    ? "0 4px 10px rgba(0,0,0,0.10)"
                    : "none",
                transition: "all 0.18s ease-in-out",
              }}
            >
              Proactive Calls
            </button>
            <button
              onClick={() => handleModeChange("actions")}
              style={{
                border: "none",
                borderRadius: "9999px",
                padding: "6px 18px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                minWidth: "120px",
                background:
                  mode === "actions" ? "#ffffff" : "transparent",
                color:
                  mode === "actions" ? "#111827" : "#6b7280",
                boxShadow:
                  mode === "actions"
                    ? "0 4px 10px rgba(0,0,0,0.10)"
                    : "none",
                transition: "all 0.18s ease-in-out",
              }}
            >
              Actions
            </button>
          </div>
        </div>


{/* Bubbles row (desktop wraps, mobile scrolls horizontally) */}
<div
  style={{
    display: "flex",
    flexWrap: isMobile ? "nowrap" : "wrap",
    gap: isMobile ? "8px" : "10px",
    padding: "4px 0",
    overflowX: isMobile ? "auto" : "visible",
    WebkitOverflowScrolling: "touch",
    width: "100%",
  }}
>
          {activeBubbles.map((a) => (
            <button
              key={a.key}
              onClick={() => handleClick(a.key)}
              style={{
                flexShrink: 0,
                padding: "9px 16px",
                borderRadius: "24px",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                background:
                  selected === a.key ? "#db3514" : "#f3f4f6",
                color:
                  selected === a.key ? "#ffffff" : "#374151",
                boxShadow:
                  selected === a.key
                    ? "0 4px 12px rgba(219,53,20,0.35)"
                    : "0 2px 4px rgba(0,0,0,0.10)",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.18s ease-in-out",
              }}
            >
              {a.label} (<b>{a.key}</b>)
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 16px 32px 16px",
        }}
      >
        {/* ====== ACTIONS CONTENT ====== */}

        {selected === "DYK" && (
          <div
            style={{
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "25px 30px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "15px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              The Did You Know Question (DYK)
            </h2>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Purpose:</strong> To inform and educate your clients about additional products and services they can buy from you. Each DYK should be about a product or service that your clients can buy.
            </p>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Success Rate:</strong> 20% of DYK questions close business.
            </p>
            <p
              style={{
                fontWeight: 600,
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              Examples:
            </p>
            <ul
              style={{
                marginLeft: "20px",
                color: "#374151",
              }}
            >
              <li>Did you know we have the Carrier furnace line?</li>
              <li>Do you want me to add pipe, tape, filters, and drain line to this? [That’s four DYKs in three seconds.]</li>
              <li>Did you know we sell caustic soda?</li>
              <li>How are you on your business insurance?</li>
              <li>Do you need any intellectual property filings?</li>
              <li>What about one-by-fours? [A lumber measurement.]</li>
              <li>Did you know we can sell these in drums or totes? [That’s two DYKs.] </li>
            </ul>
            <p
              style={{
                fontWeight: 600,
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              Finer Points:
            </p>
            <ul
              style={{
                marginLeft: "20px",
                color: "#374151",
              }}
            >
              <li>Each DYK is about one product or service.</li>
              <li>DYKs focus on things clients can pay you for. It’s okay to mention things they cannot pay for, such as, did you know we have been in business over 100 years? But these statements need to be accompanied by mentions of products and services the clients can buy. They also don’t count for tracking purposes.</li>
              <li>Stack them. Ask multiple DYKs to the same client.</li>
              <li>If you ask three DYKs together—for instance, did you know I do keynote speeches, workshops, and sales kickoff meetings?—you should take credit for three DYKs in the tracking form.</li>
            </ul>
          </div>
        )}

        {selected === "rDYK" && (
          <div
            style={{
              marginTop: "20px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "25px 30px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "15px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              The Reverse Did You Know Question (rDYK)
            </h2>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Purpose:</strong> To let the clients name additional products or services that they need but do not currently buy from you.
            </p>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Success Rate:</strong> 80%. Four out of five times, the customer will happily share with you what they buy elsewhere. It is, frankly, as close to a sure thing as salespeople can get in their profession. Sometimes the answer will be “We buy everything from you.” This may be true, but you may want to confirm by asking some DYKs about products or services you think they could benefit from but do not currently buy from you.
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Examples:</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>What else do you need to be quoted?</li>
              <li>What else are you buying from my competition that I can help you with?</li>
              <li>We’re going to have a delivery to you next week; what else would you like me to add to it? [This is an incredibly effective question for product companies.]</li>
              <li>What else is on your wish list?</li>
              <li>What’s going on today? [It’s fascinating that customers will often launch into the products and services they need from you when asked this question.]</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>The rDYK is the “what else” question.</li>
              <li>You should ask one rDYK question during every single conversation.</li>
              <li>This is actually the single most effective Outgrow communications technique, both in terms of success rate and the sheer quantity of products and services the client will name.</li>
              <li>The DYK fires products and services at the client, and you have to hope to hit a bull’s-eye, one at a time. The rDYK simply asks the client what else they need, and they tell us—often in bunches of products and services at once.</li>
            </ul>
          </div>
        )}

        {selected === "Pivot" && (
          <div
            style={{
              marginTop: "20px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "25px 30px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "15px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              The Pivot to the Sale (Pivot)
            </h2>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Purpose:</strong> To close the business being
              discussed now.
            </p>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Success Rate:</strong> 25%, which is much higher than not asking for the business. One of four requests for the business is rewarded with the client thanking you with money!
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Examples:</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>When would you like us to deliver?</li>
              <li>When do you want to start this project?</li>
              <li>When can I expect the purchase order?</li>
              <li>How would you like to pay?</li>
              <li>How many do you want?</li>
              <li>Do you want to lock this in before next month’s price increase?</li>
              <li>I can have this to you by Monday. [Not a question like the others.]</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>This is the “when” question.</li>
              <li>Like the rDYK “what else” question, it should be asked during every single conversation. What else do you need? When do you want that?</li>
              <li>Pivot after every DYK.</li>
              <li>The client has been talking with you about your products or services, and you have had a fairly detailed conversation about their needs. At the end of it, ask to help them with this business. You are not bothering or annoying or selling to them. You are simply asking to make their lives easier. If they don’t say “yes, I want it” or “no, I don’t,” they have to think about it again in the future. </li>
              <li>It’s only fair to ask the client to finally sell them the product or service you’ve both spent time formulating.</li>
              <li>These pivots to the sale can be used following each DYK and rDYK in conversation.</li>
            </ul>
          </div>
        )}

        {selected === "Pivot-C" && (
          <div
            style={{
              marginTop: "20px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "25px 30px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "15px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              The Pivot to the Next Conversation (Pivot-C)
            </h2>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Purpose:</strong> To schedule the next call or
              meeting.
            </p>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Success Rate:</strong> 75% schedule the next conversation. Sometimes it’s not time to ask for the business yet. Or perhaps you deal with longer sales cycles. If your business opportunity requires another conversation (or a series of them), clients tend to easily and happily schedule it. Three out of four of these conversation requests succeed, statistically. That’s a tremendously rewarding way for you to progress the opportunity toward a quote, proposal, or close.
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Examples:</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>When would you like to talk again?</li>
              <li>Let’s schedule our conversation before we hang up.</li>
              <li>Since we’re talking, what’s a good day for us to talk again?</li>
              <li>I can be out there next week—what’s good for you?</li>
              <li>I think we should meet and spend some time together. How’s the week of the 14th?</li>
              <li>What do you want to do next ?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>Never hang up the phone or leave a meeting without knowing what the next interaction will be and when it will happen. If there is nothing scheduled for this opportunity, you will probably lose track of it and not follow up at the correct time. Even in my small business, if it’s not on my calendar, it’s probably not going to happen—I’m busy, and my clients and prospects are busy. This pivot to the next conversation gets it on the calendar!</li>
              <li> Sometimes the sales cycle is longer and demands multiple conversations over weeks, months, and even years. The Pivot-C technique allows you to schedule them. Always put the next conversation on the calendar before the current one ends.</li>
              <li>Having these scheduled is valuable to both you and your client or prospect. They don’t want to drop the ball on an important project you are helping them with. It helps you both remember.</li>
            </ul>
          </div>
        )}

        {selected === "%Biz" && (
          <div
            style={{
              marginTop: "20px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "25px 30px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "15px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              The Percent of Business Question (%Biz)
            </h2>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Purpose:</strong> To ask for more business, and
              in the process learn how much business you have with a
              particular client.
            </p>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Success Rate:</strong> In 85% of these you will learn what percent of their business the client gives.
            </p>
            <p
              style={{
                fontWeight: 600,
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              Examples:
            </p>
            <ul
              style={{
                marginLeft: "20px",
                color: "#374151",
              }}
            >
              <li>The %Biz question is a two-part question.</li>
            </ul>
            <p
              style={{
                fontWeight: 600,
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              Part One:
            </p>
            <ul
              style={{
                marginLeft: "20px",
                color: "#374151",
              }}
            >
              <li>
                What percent of your business would you guess we
                have?
              </li>
              <li>How much of your business do you think we get?</li>
            </ul>
            <p
              style={{
                fontWeight: 600,
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              Part Two:
            </p>
            <ul
              style={{
                marginLeft: "20px",
                color: "#374151",
              }}
            >
              <li>
                That’s interesting. You’re one of my best clients. What are you doing with the other business? Where’s it going? I’d love to get a shot at it.
              </li>
              <li>
                How do I earn the rest of that business? I’d sure enjoy working with you on that.
              </li>
            </ul>
            <p
              style={{
                fontWeight: 600,
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              Finer Points:
            </p>
            <ul
              style={{
                marginLeft: "20px",
                color: "#374151",
              }}
            >
              <li>The client will almost always answer your question about how much of their business comes to you. So, at minimum, you will learn tremendously valuable information about what you have and what is available with them.</li>
              <li>You will also learn what’s happening with the work you’re not getting. You will know where it goes, and why. Is it because of the price? Availability? Or maybe they’re just one of these companies that is required to spread their eggs across various baskets. This happens. But you probably don’t know if this is the case today, and you will after asking the %Biz question.</li>
              <li>Most Outgrowers do not start with this question. I think the reason is that it’s a little more complex than the others (involving two steps) and also it’s probably a bit more threatening than the others. It requires more confidence and boldness.</li>
            </ul>
          </div>
        )}

        {selected === "iREF" && (
          <div
            style={{
              marginTop: "20px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "25px 30px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "15px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              The Internal Referral Request (iREF)
            </h2>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Purpose:</strong> To be connected to additional potential buyers at a current client company.
            </p>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Success Rate:</strong> 66%. Quite high, right?
              So why not ask?
            </p>
            <p
              style={{
                fontWeight: 600,
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              Examples:
            </p>
            <ul
              style={{
                marginLeft: "20px",
                color: "#374151",
              }}
            >
              <li>Who else do you work with who I should be helping?</li>
              <li>What other people do similar work to yours who I can be helping?</li>
              <li>Who else do I need to know at your firm?</li>
              <li>What other locations / divisions / regions / buildings / profit centers are there that I should be trying to help the way that I help you? Who should I be talking with?</li>
            </ul>
            <p
              style={{
                fontWeight: 600,
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              Finer Points:
            </p>
            <ul
              style={{
                marginLeft: "20px",
                color: "#374151",
              }}
            >
              <li>Salespeople are often not selling to every person who buys what they sell at a company.</li>
              <li>People love to give referrals, especially internally within their company. They help a colleague, and you. The colleague is happy, and you’ve been rewarded with more business. Also, when they need something from you in the future, you will be more inclined to help them above others.</li>
              <li>Note that none of the questions here are yes or no questions. They are all who else and what else questions. As a general rule, try to stay away from yes or no questions in sales situations, and especially so with referral requests. It’s easy to do, and most salespeople ask: “Do you know anyone else I should be working with?” What’s the easy, obvious answer for the customer? “No, I don’t think so!”</li>
              <li>This is low-hanging fruit. You’re already doing good business with the clients, and your trust together is strong. You are in their system as a provider, and they are in your system as a client. It’s easy to help this company more.</li>
              <li>If the company is a contractor or a law firm or an interior design agency, and you are doing business with one of their people but there are 5 to 10 other people in the company, you are likely to easily grow your business exponentially with this company. And why not? All those people not getting your value today are suffering through your competition.</li>
              <li>This is another reason why it’s important to think of your clients in terms of the people you are helping rather than as the companies they work for. When you think of corporations, it closes off considering additional potential buyers.</li>
            </ul>
          </div>
        )}

        {selected === "xREF" && (
          <div
            style={{
              marginTop: "20px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "25px 30px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "15px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              The External Referral Request (XREF)
            </h2>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Purpose:</strong> To be connected to prospective clients who your current client knows.
            </p>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Success Rate:</strong> 66%. If you follow these
              three steps.
            </p>
            <p
              style={{
                fontWeight: 600,
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              Three-Step Examples: Who, How, When
            </p>
            <ol
              style={{
                marginLeft: "20px",
                color: "#374151",
              }}
            >
              <li>Who else do you know, like yourself, who I can help the way that I help you? [Then be silent while the person thinks. They’re not quiet because they are uncomfortable. They are quiet because they’re thinking.]</li>
              <li>Thank you. I appreciate this. How should I reach out? Do you prefer that I contact them and use your name, or would you like to connect us? [Most people will choose to make the connection, often over email.]</li>
              <li>I know how busy you are. So that I don’t bother you, when do you think you might get to it? [They will say something like, “I’ll call or email you both by the end of the week,” or “I’ll send you their contact info by the end of this week.”] Okay, great. So if I don’t hear from you by the end of day Friday, is it okay with you if I follow up with you on this on Monday? [I’ve never had a client tell me no.]</li>
            </ol>
            <p
              style={{
                fontWeight: 600,
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              Finer Points:
            </p>
            <ul
              style={{
                marginLeft: "20px",
                color: "#374151",
              }}
            >
              <li>As mentioned, silence is everything here. Ask your question and look away and count to 100 if you have to. Sing a song in your head (not out loud). But do not speak until your client gives you an answer.</li>
              <li>Like internal referrals, people love giving external referrals. They have a friend in the industry who you can help. They know you are great to work with. They connect you two. Who comes out best in this exchange? Always, the referrer. They get to help their friend and send you business. And, again, if they need something urgently tomorrow, you will be more inclined to drop what you are doing to help them because they just sent you a referral. You will feel like you owe them this. And that’s another reason people love to give referrals.</li>
              <li>After the client responds to your when request, write down the date. Also, be sure to write down the day you said you will follow up. And absolutely put it on your calendar with an alert. You committed to following up—you should do everything you can to do so. It would be professional malpractice to get a referral and not follow up on the connection or contact information.</li>
            </ul>
          </div>
        )}

        {selected === "Note" && (
          <div
            style={{
              marginTop: "20px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "25px 30px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "15px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              The Handwritten Note (Note)
            </h2>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Purpose:</strong> What’s even rarer than a proactive call? The basically extinct handwritten note. The proactive calls put you in very rare air—among approximately 5% of companies and people who sell. The handwritten note, on the other hand, makes you basically singular. If you send a client a handwritten note, it is likely to be the only one they receive this year. Sure, they might get a greeting card for their birthday, or printed and mail-merged holiday cards, but a handwritten note is different. Outgrow notes are not thank-you notes. Rather, they are human notes that include a line or two about something you recently talked about with your client. This can include something they did on vacation, a sports team you discussed, a home improvement project, or dropping the kids off at school. It’s okay to say thank you in these notes, but it should be secondary to something that was recently discussed. 
            </p>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Example:</strong>
            </p>
            <ul
              style={{
                marginLeft: "20px",
                color: "#374151",
              }}
            >
              <li>
                Dear Tom,<br />
                I really enjoyed our conversation this week, and I hope you had a wonderful, relaxing break in Florida. Can’t wait to hear about it!<br />
                Warm regards,<br />
                Ryan Pisciotta<br />
                Or . . .<br />
              </li>
              <li>
                Dear Tom,<br />
                I’m sorry your Rams lost to my Bears this week—it was an exciting game. Your Rams sure look to be in great shape for the future!<br />
                See you soon,<br />
                Ryan Pisciotta<br />
              </li>
            </ul>
            <p
              style={{
                fontWeight: 600,
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              Finer Points:
            </p>
            <ul
              style={{
                marginLeft: "20px",
                color: "#374151",
              }}
            >
              <li>
              Please note there is no mention of business. Or your upcoming call or meeting. There is not even a phone number included, although you can handwrite it under your name if you’d like. Absolutely no business cards should be placed in these envelopes. You will find that nearly everyone you send a note like this to will get back to you. Most of these follow-up communications will come by email, which is ironic, but ultimately, good for future business expansion.
              </li>
            </ul>
          </div>
        )}

        {selected === "Comm" && (
          <div
            style={{
              marginTop: "20px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "25px 30px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "15px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              Communicating a Testimonial (Comm)
            </h2>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Purpose:</strong> To demonstrate to a prospective client how happy your current clients are, and help make them aspire to—and desire—the same value. 
            </p>
            <p
              style={{
                color: "#374151",
                marginBottom: "15px",
              }}
            >
              <strong>Example:</strong>
            </p>
            <ul
              style={{
                marginLeft: "20px",
                color: "#374151",
              }}
            >
              <li>
              We have a client similar to you, and here is what they have to say about us. Quote [then read into the phone the testimonial you have selected], close quote. I’d love the opportunity to help you this way. When can we connect to discuss what that looks like? [This is a Pivot-C, to the next conversation.]
              </li>
            </ul>
            <p
              style={{
                fontWeight: 600,
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              Finer Points:
            </p>
            <ul
              style={{
                marginLeft: "20px",
                color: "#374151",
              }}
            >
              <li>These are most often delivered to prospects, not clients.</li>
              <li>You can also target current clients who you would like to expand business with by sharing a testimonial from a different client who is buying the products or services you wish to sell to the recipient of this testimonial.</li>
              <li>If you said to the prospect that you will save them time, and that you will have a great, friendly relationship revolving around mutual trust and respect, it would be kind of weird. And awkward. But when you put quotes around it and lead with “our clients say . . .” and end with “we’d like to do this for you,” it’s just the truth. It’s credible. And the prospect is not only listening intently, they are likely desiring the same benefits your other clients are praising.</li>
            </ul>
          </div>
        )}

        {/* ====== PROACTIVE CALLS CONTENT (DUMMY PLACEHOLDERS) ====== */}

        {selected === "PD" && mode === "calls" && (
          <div
            style={{
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px 26px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              Calls to Clients Who Just Got a Product or Service from You (PD)
            </h2>
            <p style={{ color: "#374151", marginBottom: "10px" }}>
              These are calls to people who just received a product or service from your company. These kinds of communications used to be quite common. The last bastion of these communications were car dealerships. The first few cars I purchased in my life, I got a post-delivery call every time. Not so over the last decade or so, and as I get older, I’ve been buying nicer cars. You’d think salespeople would want to lock in the relationship and take simple steps to help ensure a client returns. They may want to, but I wouldn’t know it. These are fantastic activities for client service people or inside salespeople because they are proactive client service inquiries first and foremost. Then, once you confirm that all is well with your delivery or service, shift to your rDYKs and DYKs.
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part One: The Opening</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>
                Hi, Emily, this is Paul calling. How are you? All good in your world? Kiddos doing well? <br />
                Hey, I’m just calling to make sure everything arrived okay. Does everything look good? <br/>
                Do you need anything else on that order?
              </li>
              <li>
                If you fixed something recently . . .
                <ul><li>Is everything working okay? Nothing causing you problems?</li></ul>
              </li>
              <li>
                If you provided business services . . .
                <ul><li>How is everything going with what we talked about in our planning session? Any questions? Need anything else from me on that?</li></ul>
              </li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Two: Shift to the Business</p>
            <ul>
              <li>Great!</li>
              <li><b>DYK:</b> Listen, I don’t know if you knew this, but we also have one-on-one coaching services for the folks that were involved in our session.</li>
              <li><b>rDYK:</b> What else do you have coming up that I can help you with?</li>
              <li><b>rDYK:</b> Are you thinking about any new hires that I should put on my calendar to be on standby to help with?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Three: Pivot to the Sale or Next Conversation</p>
            <ul>
              <li><b>Pivot:</b> Listen, it has been great catching up. I’ll put it on my calendar to call again two weeks from today—that’s Monday the seventh. Good for you?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul>
              <li>This conversation is a proactive call, with one DYK, two rDYKs, and a pivot—five total actions to be logged.</li>
            </ul>
          </div>
        )}


        {selected === "OH" && mode === "calls" && (
          <div
            style={{
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px 26px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              Order History Call (OH)
            </h2>
            <p style={{ color: "#374151", marginBottom: "10px" }}>
              These calls are to clients whose frequency of ordering certain products or services has dropped off. These clients used to buy weekly or monthly, but now it has been several months since they’ve made a purchase. If they used to buy frequently, but now they’ve stopped, they haven’t stopped buying altogether; they’ve simply stopped buying from you. So this call is your company’s attempt to get the business back. Your people are showing these clients that they (1) noticed, (2) are interested, and (3) are trying to help.
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part One: The Opening</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>
                Hello, Michelle, it’s Bob calling from ABC company. How are you? Did your family trip go well? Listen, we were just talking about you here because we noticed that it has been seven months since you purchased any control panels. You used to buy them twice a month or so.
              </li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Two: Shift to the Business</p>
            <ul>
              <li><b>Pivot:</b> We’d sure like to help you with that again.</li>
              <li><b>DYK:</b> We also carry brands X, Y, and Z now, in case you were looking for some different lines. [Three DYKs]</li>
              <li><b>rDYK:</b> What else do you have happening over there that I can help with?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Three: Pivot to the Sale or Next Conversation</p>
            <ul>
              <li><b>Pivot:</b> Okay, great, so I’ll write it up and get this out to you. When do you want us to deliver?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul>
              <li>This would be logged as one proactive call, three DYKs, one rDYK, and two pivots, for seven total swings.</li>
            </ul>
          </div>
        )}

        {selected === "CWE" && mode === "calls" && (
          <div
            style={{
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px 26px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              Calls to Clients Who Email (CWE)
            </h2>
            <p style={{ color: "#374151", marginBottom: "10px" }}>
              This category doesn’t require a list because every client-facing person at your company already has a living, breathing, auto-updating, current-to-the-minute list of these clients and prospects. This list lives in each person’s email inbox. All day long, you receive emailed requests for products, services, pricing, and client service issues. This proactive calling technique turns this incoming flood of items to respond to into an easy list of people to call proactively. These calls go something like this:
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part One: The Opening</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>
                Hi, Max, it’s Alex. I received your email, and I’m putting the quote together for this now.<br/>
                Or . . .
              </li>
              <li>
                Hi, Max, it’s Alex. I got your email, and I am checking on that for you right now. I’ll let you know as soon as I hear . . . 
                But listen, it has been a while since we talked. How are you? How is your family doing?
              </li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Two: Shift to the Business</p>
            <ul>
              <li><b>rDYK:</b> What else do you have going on that I can help you with?</li>
              <li><b>rDYK:</b> What am I not quoting you?</li>
              <li><b>DYK:</b> We’ve had some new product lines come in since we last talked, including A, B, C, and D. [This is four DYKs.]</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Three: Pivot to the Sale or Next Conversation</p>
            <ul>
              <li><b>Pivot:</b> Would you like me to add any of those items to this quote?</li>
              <li><b>Pivot-C:</b> Should we get together to talk about that?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul>
              <li>You would take credit for one proactive call, four DYKs, two rDYKs, and two pivots for a total of nine actions.</li>
            </ul>
          </div>
        )}

        {selected === "ZD30" && mode === "calls" && (
          <div
            style={{
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px 26px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              Calls to Zero Dark 30 Clients (ZD30)
            </h2>
            <p style={{ color: "#374151", marginBottom: "10px" }}>
              These are clients who have done a significant amount of business with you over the last year (pick your number) but zero over the last month.
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part One: The Opening</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>
                Hi, Sally, it’s Tom Jones. I was thinking about you because I noticed we haven’t done as much business together over the last month, and I wanted to check in. How are you? How’s your family?
              </li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Two: Shift to the Business</p>
            <ul>
              <li><b>DYK:</b> You had been buying 10 units of product X most months, but I don’t think you’ve ordered any recently.</li>
              <li><b>Intermediate Pivot:</b> Do you want me to get some out to you?</li>
              <li><b>Another DYK:</b> What about products Y and Z? How are you on those? [Two products are mentioned, so you would take credit for two DYKs.]</li>
              <li><b>Another Intermediate Pivot:</b> Should we add those to the order as well?</li>
              <li><b>rDYK:</b> What else do you need?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Three: Pivot to the Sale or Next Conversation</p>
            <ul>
              <li><b>Pivot:</b> I’ll get the quote together and have it to you. When can I expect the PO?</li>
              <li><b>Another Pivot:</b> Great, if I don’t hear from you by that day, is it okay to reach out to you about this?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul>
              <li>In this interaction, you would log and take credit for a proactive call, three DYKs, one rDYK, and four pivots to the sale, for a total of <b>eight</b> Outgrow actions—in a conversation that probably took three minutes.</li>
            </ul>
          </div>
        )}

        {selected === "RAP" && mode === "calls" && (
          <div
            style={{
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px 26px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              Calls to Clients on Revenue Autopilot (RAP)
            </h2>
            <p style={{ color: "#374151", marginBottom: "10px" }}>
            These are clients who are buying a consistent set of products and services, accounting for a narrow band of total monthly revenue. Their purchasing is on autopilot because they have niched you for the specific things they buy.
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part One: The Opening</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>
              Hi, Mark, it’s Christy Owens. I know it has been a while since we talked, but I wanted to pick up the phone and catch up. You guys are an important client for me, and I wanted to see how else I can help. But before we go there, how is your family? What are the kids doing?
              </li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Two: Shift to the Business</p>
            <ul>
              <li><b>rDYK:</b> So what’s going on with your business? [This is a legitimate and effective rDYK.]</li>
              <li><b>DYK:</b> Did you know we carry products a and b now? [Two DYKs]</li>
              <li><b>Intermediate Pivot:</b> Can I add those to your next order?</li>
              <li><b>rDYK:</b> What else do you have coming up that we can help you with?</li>
              <li><b>rDYK:</b> What projects are coming up?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Three: Pivot to the Sale or Next Conversation</p>
            <ul>
              <li><b>Pivot-C:</b> Would love to get our business back to where we were and, ideally, even beyond that. Our work is important to me. When would you like to get together to solidify this? [This is a pivot to the next conversation.]</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul>
              <li>
              This brief conversation would be logged as one proactive call, two DYKs, three rDYKs, and two pivots for a total of eight proactive actions.
              </li>
            </ul>
          </div>
        )}

        {selected === "DR" && mode === "calls" && (
          <div
            style={{
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px 26px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              Calls to Clients with Decreasing Revenue (DR)
            </h2>
            <p style={{ color: "#374151", marginBottom: "10px" }}>
              These are clients whose revenue is on the decline. They are buying less and less.
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part One: The Opening</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>
                <p>
                Hi, Cindy, it’s Mark Ellis. How are you? How’s your family? How was summer for the kids? I was thinking about you because a client of mine is doing some interesting things with us that I think would work well for you too. I took a look at your account, and I noticed that we’re not sending you as much products X and Y like we used to.
                </p>
                <p>
                [This is more of a client service outreach, where you are asking if something happened, or if something is wrong. It gives the client a chance to vent, which is always better than stewing in silence about something that upsets them. You might learn nothing negative occurred and you had some business poached by competition.]
                </p>
              </li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Two: Shift to the Business</p>
            <ul>
              <li><b>rDYK:</b> How are you doing with your inventory of products X and Y?</li>
              <li><b>Intermediate Pivot:</b> I’d love to have the opportunity to earn that business back.</li>
              <li><b>rDYK:</b> What else is happening that I can help you with?</li>
              <li><b>%Biz:</b> What percent of your business would you guess we have?</li>
              <li><b>DYK:</b> Are you all sourcing services X and Y these days? [Two DYKs]</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Three: Pivot to the Sale or Next Conversation</p>
            <ul>
              <li><b>Pivot-C:</b> Why don’t we get together in the next couple of weeks and cement all this? I can be there in two weeks on Tuesday or Wednesday. Is one of those better than the other?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul>
              <li>
              This conversation will be logged as one proactive call, two DYKs, two rDYKs, one %Biz, and two pivots for eight total proactive actions.
              </li>
            </ul>
          </div>
        )}

        {selected === "PC" && mode === "calls" && (
          <div
            style={{
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px 26px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              Calls to Clients Who Used to Buy but Stopped (PC)
            </h2>
            <p style={{ color: "#374151", marginBottom: "10px" }}>
              This group of clients are past clients with whom you no longer do business. This call is your attempt to get that client back. It doesn’t have to be everything you once did together. We’re just trying to get them to dip a toe back in the water.
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part One: The Opening</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>
              Hi, Chris, it’s Kathy calling. Gosh, I didn’t realize how long it has been since we talked until I happened to see that we haven’t seen any orders from you in over a year. How are you doing? What’s new with your family? Is everyone doing well? Well, listen, I know we had some problems with inventory back then, but we’ve made a bunch of fixes—systems and people—and things are much smoother now.
              </li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Two: Shift to the Business</p>
            <ul>
              <li><b>Pivot:</b> We’d sure love to get some of your business back. [Then be silent.]</li>
              <li><b>Pivot:</b> I’d love to earn your business again. [Silence.]</li>
              <li><b>Pivot:</b> Would you be open to giving us another chance? I’ll oversee your account personally. [Silencio!]</li>
              <li><b>rDYK:</b> Also, I was wondering, what else do you have coming up that we can help with?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Three: Pivot to the Sale or Next Conversation</p>
            <ul>
              <li><b>Pivot:</b> Thank you so much for that. I’m grateful for the opportunity to work with you again. I’ll put this first order together, send you a quote, and get it out on Friday if all that works for you. [Pivots can be statements and don’t have to be questions.]</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul>
              <li>
              This conversation was a proactive call, four pivots, and an rDYK. <b>Six</b> total swings to be logged.
              </li>
            </ul>
          </div>
        )}

        {selected === "QFU" && mode === "calls" && (
          <div
            style={{
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px 26px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              Calls to Clients with an Outstanding Quote or Proposal (QFU)
            </h2>
            <p style={{ color: "#374151", marginBottom: "10px" }}>
              These are quote and proposal follow-up calls. This is the fastest-acting Outgrow call because it generates the most sales dollars the fastest.
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part One: The Opening</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>
                Hi, Robyn, it’s Joe. How are you? All good today? [The opening is quicker here because it’s likely you recently spoke at length to put the quote or proposal together.]
              </li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Two: Shift to the Business</p>
            <ul>
              <li><b>QFU (Quote Follow-Up):</b> Listen, where are you at on that quote? I was thinking about you, and would love to help with that.</li>
              <li><b>rDYK:</b> Great. Anything else you’d like me to add to the quote?</li>
              <li><b>rDYK:</b> What do you have coming up in the next few weeks that you want me to look up for you?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Three: Pivot to the Sale or Next Conversation</p>
            <ul>
              <li><b>Pivot:</b> Excellent, so I’ll process the order and you’ll get the PO to me this Morning.</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul>
              <li>
              This is a quick one. A proactive call, a QFU, two rDYKs, and a pivot. Five swings to enter into the tracking form.
              </li>
            </ul>
          </div>
        )}


        {selected === "PQFU" && mode === "calls" && (
          <div
            style={{
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px 26px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              Calls to Clients Who Have a Pre-Quote or Proposal Opportunity (PQFU)
            </h2>
            <p style={{ color: "#374151", marginBottom: "10px" }}>
            These clients are not quite to the quote or proposal stage yet, and the purpose of the call is to move them toward that quote or proposal. You are advancing the business toward the next crucial step.
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part One: The Opening</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>
              Hey, Cindy, it’s Dawn. How are you? Are you guys doing okay in that crazy weather? I was thinking about our last conversation, which I really enjoyed, and I wanted to call . . .
              </li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Two: Shift to the Business</p>
            <ul>
              <li><b>Pivot:</b> . . . to see if you were ready for a proposal on that work we discussed.</li>
              <li><b>Pivot:</b> I’d sure like to help you with that project we discussed. [Silence.]</li>
              <li><b>rDYK:</b> Is there anything you would like to add to the work, while we’re talking about it?</li>
              <li><b>DYK:</b> I have several other clients who are working on X and Y with me, actually. [Two DYKs]</li>
              <li><b>Pivot:</b> Would you like me to write that up and add it to the proposal?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Three: Pivot to the Sale or Next Conversation</p>
            <ul>
              <li><b>Pivot: Excellent.</b> I’ll put that together and have it to you within 24 hours. [Silence—wait for acknowledgement or okay.]</li>
              <li><b>Pivot:</b> And when do you think you’ll have it back to me? [Count to 100 in your head, but don’t talk.]</li>
              <li><b>Pivot:</b> Great, and if I don’t hear from you next week, is it okay to follow up the following week? [Not a word!]</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul>
              <li>
              This is a proactive call with six pivots, two DYKs, and one rDYK, for a total of ten actions—in a conversation that is likely less than five minutes.
              </li>
            </ul>
          </div>
        )}

        {selected === "LC" && mode === "calls" && (
          <div
            style={{
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px 26px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              Calls to Your Large Clients Who Can Buy Even More (LC)
            </h2>
            <p style={{ color: "#374151", marginBottom: "10px" }}>
            These clients, added together, make up the bulk of your revenue, but these calls go to those of them that can buy even more.
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part One: The Opening</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>
              How are you, Joe? It’s Greg calling. Is everything going well today? [This opening can be shorter because I am presuming you speak to these clients frequently.]
              </li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Two: Shift to the Business</p>
            <ul>
              <li><b>rDYK:</b> Listen, I know we do a lot of work together, but I was wondering—what else do you have going on that I’m not helping you with?</li>
              <li><b>rDYK:</b> What am I not quoting?</li>
              <li><b>Internal Ref:</b> Who else do you work with who buys what you buy?</li>
              <li><b>DYK:</b> How are you on products X or Y? [Two DYKs]</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Three: Pivot to the Sale or Next Conversation</p>
            <ul>
              <li><b>Pivot:</b> So you think you’ll give me that list of products by tomorrow?</li>
              <li><b>Pivot:</b> And if I don’t hear from you, is it okay to follow up the following day?</li>
              <li><b>Pivot:</b> Also, thank you for the referral to your colleague. I’ll look for their contact info from you today.</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul>
              <li>
              This is a proactive call, with two rDYKs, two DYKs, one internal referral request, and three pivots to the sale. That’s nine total swings of the bat to log.
              </li>
            </ul>
          </div>
        )}

        {selected === "SMC" && mode === "calls" && (
          <div
            style={{
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px 26px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              Calls to Small and Medium Clients Who Can Buy More (SMC)
            </h2>
            <p style={{ color: "#374151", marginBottom: "10px" }}>
            This is client enlargement work, turning smaller clients into bigger clients. These calls go to clients who don’t hear from your team very much because of the less significant revenue they drive in your business.
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part One: The Opening</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>
              Hi, Kristen, it’s Ryan Pisciotta calling. How are you? How’s your family? I know it has been a while since we talked, but I was thinking about you because we just got some product in that I think would be helpful for you.
              </li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Two: Shift to the Business</p>
            <ul>
              <li><b>DYK:</b> We got in products X, Y, and Z, and I know you use those with customers.</li>
              <li><b>Pivot:</b> Would you like me to set some aside for you?</li>
              <li><b>rDYK:</b> What else do you have coming up that I can help with?</li>
              <li><b>rDYK:</b> Is there anything you would like me to add to the truck?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Three: Pivot to the Sale or Next Conversation</p>
            <ul>
              <li><b>Pivot:</b> Okay, great. I have it written down and will get the quote out to you today, okay?</li>
              <li><b>Pivot:</b> When can I expect the purchase order?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul>
              <li>
              This is a proactive call, with one DYK, two rDYKs, and three pivots, for a total of <b>seven</b> Outgrow actions on this one interaction.
              </li>
            </ul>
          </div>
        )}

        {selected === "PP" && mode === "calls" && (
          <div
            style={{
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px 26px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              Calls to Prospects You’ve Talked To Who Did Not Buy (PP)
            </h2>
            <p style={{ color: "#374151", marginBottom: "10px" }}>
            These are prospective clients who went down the road toward a sale with you but ultimately did not buy. They are an extremely valuable and overlooked group of prospects to call on.
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part One: The Opening</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>
              Hi, Samantha, it’s Sabrina Smith calling with XYZ company. How are you? I know we haven’t talked in some time, but I was thinking about you and the project [or initial order] we had framed out because I recently had a client start buying something similar. I really enjoyed our conversations and wanted to check in with you and see if it might make sense to revisit our discussion.
              </li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Two: Shift to the Business</p>
            <ul>
              <li><b>rDYK:</b> What’s going on these days?</li>
              <li><b>rDYK:</b> What are you working on over the next few months?</li>
              <li><b>rDYK:</b> Anything specific come to mind where I can help?</li>
              <li><b>DYK:</b> It’s interesting—that other client that reminded me of you put together a program around A, B, and C.</li>
              <li><b>Pivot:</b> Is that something we should add to our project?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Three: Pivot to the Sale or Next Conversation</p>
            <ul>
              <li><b>Pivot:</b> Why don’t we get together and edit the proposal together? We can do it on Zoom or in person. What’s better for you?</li>
              <li><b>Pivot:</b> How about Friday?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul>
              <li>
              This is a proactive call, with three rDYKs, one DYK, and three pivots, for a total of <b>eight</b> Outgrow actions.
              </li>
            </ul>
          </div>
        )}

        {selected === "CC" && mode === "calls" && (
          <div
            style={{
              marginTop: "4px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "24px 26px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxWidth: "100%",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "20px",
                color: "#111827",
              }}
            >
              Calls to Prospects You Have Not Talked To (CC)
            </h2>
            <p style={{ color: "#374151", marginBottom: "10px" }}>
            These are calls to clients you are aware of but who are not buying from your company currently. But you know they buy the products or services you sell, and probably do so from your competition. These are cold calls, warmed up as much as possible by anchoring the prospect to the names of your clients and products and services that they recognize.
            </p>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part One: The Opening</p>
            <ul style={{ marginLeft: "20px", color: "#374151" }}>
              <li>
              Hello, Tom, it’s Chris Smith from ABC Inc. How are you, sir? Listen, I know you are with X Co. now, but I’ve heard about your work and you have an excellent reputation in our industry. We supply similar products as X Co. to customers like DEF Co. and GHI LLC, which you may know—they’re in your area.
              </li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Two: Shift to the Business</p>
            <ul>
              <li><b>Pivot:</b> Anyway, I’d love to learn what you’re working on and see if I might be able to earn some of your business.</li>
              <li><b>rDYK:</b> So tell me about your work and the kind of products you need.</li>
              <li><b>DYK:</b> Do you use products X, Y, or Z? [Three DYKs]</li>
              <li><b>rDYK:</b> What kinds of jobs do you have coming up in the next few months?</li>
              <li><b>DYK:</b> Oh, did you know we supply the XYZ line?</li>
              <li><b>rDYK:</b> What else would you like me to quote?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Part Three: Pivot to the Sale or Next Conversation</p>
            <ul>
              <li><b>Pivot:</b> This all sounds great; let me write it up and send you the quote.</li>
              <li><b>Pivot:</b> I’ll also send you a credit application—when can I expect that back?</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: "8px", color: "#111827" }}>Finer Points:</p>
            <ul>
              <li>
              This five-minute conversation is a proactive call, with three pivots, three rDYKs, and four DYKs. <b>Eleven</b> total Outgrow swings of the bat to log!
              </li>
            </ul>
          </div>
        )}




      </div>
    </div>
  );
}

export default Scripts;
