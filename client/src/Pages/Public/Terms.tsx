import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../Core/hooks';
import Footer from '../../Components/Footer';
import Navigation from '../../Components/Navigation';
import RedirectToDash from '../../Components/RedirectToDash';

function Terms() {

    const dispatch = useAppDispatch();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <RedirectToDash />
            <Navigation />
            <div className="pageHeader">
                <div style={{ textAlign: "center" }}>
                    <h1 className="homePageHeader">
                        Terms of Service
                    </h1>
                </div>
            </div>
            <div className="standardPublicPage60">
                <div className="standardPublicParagraph">
                    PLEASE READ ALL OF THE FOLLOWING TERMS CAREFULLY AS THEY CONTAIN INFORMATION REGARDING YOUR LEGAL RIGHTS, REMEDIES, AND OBLIGATIONS. THIS AGREEMENT CONTAINS A MANDATORY ARBITRATION OF DISPUTES PROVISION IN SECTION 14 THAT REQUIRES THE USE OF ARBITRATION ON AN INDIVIDUAL BASIS TO RESOLVE DISPUTES, RATHER THAN JURY TRIALS OR CLASS ACTIONS. IF YOU BECOME A SalesDoing SUBSCRIBER AND PAY BY CREDIT OR DEBIT CARD (OR OTHER PAYMENT METHOD ASSOCIATED WITH AN AUTOMATICALLY RENEWING SUBSCRIPTION), YOUR SUBSCRIPTION WILL AUTOMATICALLY RENEW FOR CERTAIN PERIODS OF TIME IF YOU DO NOT TAKE CERTAIN STEPS. SEE SECTION 4 FOR MORE INFORMATION ON THE AUTOMATIC RENEWAL TERMS APPLICABLE TO SUBSCRIPTIONS.
                </div>
                <div className="standardPublicParagraph">
                    Effective August 14, 2021
                </div>
                <div className="standardPublicParagraph">
                    This Terms of Service Agreement ("Agreement") is made between SalesDoing, Inc. ("SalesDoing") operator of SalesDoing.com and application programming interface (the "API") available therewith (collectively, the "Platform") and You ("User") who may access and use the Platform and technology thereon only pursuant to the following terms and conditions.
                </div>
                <ol className="standardPublicParagraph">
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Acceptance of Terms.</h2>
                        <div className="standardPublicParagraph">
                            By accessing and using the Platform, User hereby READS, UNDERSTANDS, ACCEPTS, and AGREES to be bound by this Agreement's terms and conditions. Should User NOT accept these terms and conditions, User must neither access nor otherwise use any part of the Platform or content or information available therewith. To the extent permitted by law, SalesDoing may amend, at any time and from time to time, this Agreement by posting a version of this Agreement to <Link to="/terms">https://SalesDoing.com/terms</Link>. SalesDoing will notify User on its website and/or via email that amended terms have been posted. User agrees that its continued use of the Platform constitutes an acceptance of such amendments. User shall have the opportunity to refuse said amendments solely by ceasing access to and utilization of the Platform.
                        </div>
                    </li>
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Residency and Age.</h2>
                        <div className="standardPublicParagraph">
                            The Platform is intended to be accessed and utilized by Users who have attained the age of majority in their respective state or province. By accessing and using the Platform, User hereby represents, warrants, and affirms that it is either at least 18 years of age, an emancipated minor, or has acquired a parent or guardian's consent. User hereby affirms that it is, at a minimum and without exception, 13 years old. The Platform is not intended to be accessed or utilized by children less than 13 years of age.
                        </div>
                    </li>
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Disclaimer of Warranties.</h2>
                        <div  className="standardPublicParagraph" style={{ fontWeight: "bold", textDecoration: "underline" }}>
                            THE PLATFORM AND THE ENTIRETY OF ITS CONTENT AND INFORMATION AND MATERIALS PROVIDED THEREWITH ARE PROVIDED "AS IS," AND SalesDoing HEREBY DISCLAIMS ALL EXPRESS AND IMPLIED WARRANTIES INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE. TO THE EXTENT PERMITTED BY LAW, SalesDoing EXPRESSLY DISCLAIMS ANY REPRESENTATION THAT: (I) THE PLATFORM WILL MEET USER'S REQUIREMENTS; (II) ACCESS TO THE PLATFORM WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (III) ANY INFORMATION OBTAINED THROUGH OR FROM THE PLATFORM WILL BE ACCURATE OR RELIABLE; (IV) THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL PURCHASED OR OBTAINED BY USER THROUGH THE PLATFORM WILL MEET EXPECTATIONS; (V) ANY USER-PROVIDED INFORMATION WILL NOT BE DISCLOSED TO THIRD-PARTIES; OR (VI) ANY DATA OR SOFTWARE ERRORS WILL BE CORRECTED.
                        </div>
                    </li>

                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Platform Uses.</h2>
                        <ol type="a" className="standardPublicParagraph">
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">SalesDoing Usage Generally.</h2>
                                <div className="standardPublicParagraph">
                                    The Platform generally allows a User, pursuant to the terms and conditions herein, to compare and re-phrase textual content User submits to the Platform ("Submissions") using the Platform's technology and obtain metrics therefrom. User may adjust SalesDoing configuration(s) to result in variations on the re-phrased textual content (the "Output") and may edit the Output to suit User's purpose(s).     
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Registration.</h2>
                                <div className="standardPublicParagraph">
                                    To use certain features of the Platform, User may be asked to register with the Platform. User agrees: (i) to provide true, accurate, current and complete information ("User Information") about itself as prompted by any registration form; and (ii) to maintain and promptly update its User Information to keep it true, accurate, current and complete. If SalesDoing has reasonable grounds to suspect that User Information is untrue, inaccurate, not current or incomplete, SalesDoing may suspend or terminate User's access to and use of the Platform (or any portion thereof). User is solely and fully responsible for maintaining the confidentiality of its username, password and, if applicable, API key ("Credentials") and is solely and fully responsible for all activities that occur under its Credentials. User agrees to: (i) immediately notify SalesDoing of any unauthorized use of User's Credentials or any other breach of security; and (ii) ensure that User logs off from its account at the end of each web applications session. SalesDoing cannot and will not be liable for any loss or damage arising from User's failure to comply with this section.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Paid Services.</h2>
                                <ol type="i"  className="standardPublicParagraph">
                                    <li className="standardPublicParagraph">
                                        <h2 className="standardPublicH2">General.</h2>
                                        <div className="standardPublicParagraph">
                                            If User purchases any services that Company offers for a fee ("Paid Services"), such as a subscription to Company's services, User authorizes Company and its designated payment processors to store User's payment information and other related information. User also agrees to pay the applicable fees for the Paid Services (including without limitation periodic fees for ongoing subscriptions (the "Subscription Fees") as they become due plus all related taxes (including, without limitation, sales and use taxes, duties, or other governmental taxes or fees), and to reimburse Company for all collection costs and interest for any overdue amounts. All fees and charges are nonrefundable and there are no refunds or credits for any partially used Paid Services (including partially used subscription periods) except: (i) as required by applicable law; and (iii) at Company's sole and absolute discretion. Fees for the Paid Services may be payable in advance, in arrears, per usage, or as otherwise described when you initially purchase the Paid Services. Except as otherwise described in this Section 4, all prices for Paid Services are subject to change without notice.
                                        </div>
                                    </li>
                                    <li className="standardPublicParagraph">
                                        <h2 className="standardPublicH2">Payment Method.</h2>
                                        <div className="standardPublicParagraph">
                                            Company may, from time to time, offer various payment methods, including without limitation payment by credit card, by debit card, by check, by certain payment providers. User authorizes Company to charge User for Paid Services through any payment method(s) User selects when purchasing the Paid Services (the "Payment Method") and User agrees to make payment using such Payment Method(s) (Company may, from time to time, receive and use updated payment method information provided by User or that financial institutions or payment processors may provide to Company to update information related to User's Payment Method(s), such as updated expiration dates or account numbers). Certain Payment Methods, such as credit cards and debit cards, may involve agreements between User and the financial institution, credit card issuer, or other provider of User's chosen Payment Methods (the "Payment Method Provider"). If Company does not receive payment from User's Payment Method Provider, User agrees to directly pay all amounts due upon demand from Company. User's non-termination or continued use of the Paid Services reaffirms that Company is authorized to charge User's Payment Method.
                                        </div>
                                    </li>
                                    <li className="standardPublicParagraph">
                                        <h2 className="standardPublicH2">Automatic Renewal of Subscriptions.</h2>
                                        <div className="standardPublicParagraph">
                                            IF USER PAYS FOR A SUBSCRIPTION BY CREDIT OR DEBIT CARD (OR OTHER PAYMENT METHOD IDENTIFIED ON COMPANY'S SERVICES OR A SOCIAL NETWORKING SITE AS INVOLVING AN AUTOMATICALLY RENEWING SUBSCRIPTION) AND USER DOES NOT CANCEL USER'S SUBSCRIPTION AS SET FORTH IN THIS SECTION 4, USER'S SUBSCRIPTION WILL BE AUTOMATICALLY EXTENDED FOR SUCCESSIVE RENEWAL PERIODS OF THE SAME DURATION AS THE SUBSCRIPTION TERM ORIGINALLY SELECTED (FOR EXAMPLE, UNLESS USER CANCELS, A ONE MONTH SUBSCRIPTION WILL AUTOMATICALLY RENEW ON A MONTHLY BASIS). UNLESS OTHERWISE INDICATED IN ANY APPLICABLE ADDITIONAL TERMS OR COMMUNICATIONS COMPANY SENDS TO USER'S REGISTERED EMAIL ADDRESS, SUCH RENEWAL WILL BE AT THE SAME SUBSCRIPTION FEE AS WHEN USER FIRST SUBSCRIBED, PLUS ANY APPLICABLE TAXES, UNLESS COMPANY NOTIFIES USER AT LEAST 10 DAYS PRIOR TO THE END OF USER'S CURRENT TERM THAT THE SUBSCRIPTION FEE WILL INCREASE. USER ACKNOWLEDGES AND AGREES THAT USERS PAYMENT METHOD WILL BE AUTOMATICALLY CHARGED FOR SUCH SUBSCRIPTION FEES, PLUS ANY APPLICABLE TAXES, UPON EACH SUCH AUTOMATIC RENEWAL. USER ACKNOWLEDGES THAT USER'S SUBSCRIPTION IS SUBJECT TO AUTOMATIC RENEWALS AND USER CONSENTS TO AND ACCEPTS RESPONSIBILITY FOR ALL RECURRING CHARGES TO USER'S CREDIT OR DEBIT CARD (OR OTHER PAYMENT METHOD, AS APPLICABLE) BASED ON THIS AUTOMATIC RENEWAL FEATURE WITHOUT FURTHER AUTHORIZATION FROM USER AND WITHOUT FURTHER NOTICE EXCEPT AS REQUIRED BY LAW. USER FURTHER ACKNOWLEDGES THAT THE AMOUNT OF THE RECURRING CHARGE MAY CHANGE IF THE APPLICABLE TAX RATES CHANGE OR IF USER IS NOTIFIED THAT THERE WILL BE AN INCREASE IN THE APPLICABLE SUBSCRIPTION FEES.
                                        </div>
                                    </li>
                                    <li className="standardPublicParagraph">
                                        <h2 className="standardPublicH2">Cancellation of Subscription.</h2>
                                        <div className="standardPublicParagraph">
                                            TO CANCEL USER'S SUBSCRIPTION AT ANY TIME, USER MAY GO TO THE "SETTINGS" PAGE AFTER LOGGING INTO THE PLATFORM AND ELECT TO “CANCEL". IF USER CANCELS USER'S SUBSCRIPTION, USER'S SUBSCRIPTION BENEFITS WILL CONTINUE UNTIL THE END OF USER'S THEN-CURRENT SUBSCRIPTION TERM, BUT USER'S SUBSCRIPTION WILL NOT BE RENEWED AFTER THAT TERM EXPIRES. USER WILL NOT BE ENTITLED TO A PRORATED REFUND OF ANY PORTION OF THE SUBSCRIPTION FEES PAID FOR THE THEN-CURRENT SUBSCRIPTION TERM. USER WILL FORFEIT ANY AND ALL UNUSED USAGE CREDITS, WORDS, FEATURES, ETC.
                                        </div>
                                    </li>
                                    <li className="standardPublicParagraph">
                                        <h2 className="standardPublicH2">Change of Subscription.</h2>
                                        <div className="standardPublicParagraph">
                                            TO CHANGE USER'S SUBSCRIPTION AT ANY TIME, USER MAY GO TO THE "SETTINGS" PAGE AFTER LOGGING INTO THE PLATFORM AND ELECT TO "CHANGE PLAN". IF USER CHANGES USER'S SUBSCRIPTION, USER'S CURRENT SUBSCRIPTION BENEFITS WILL IMMEDIATELY END AND USER'S NEW BENEFITS BEGIN. USER WILL NOT BE ENTITLED TO A PRORATED REFUND OF ANY PORTION OF THE ENDING SUBSCRIPTION AND USER WILL FORFEIT ANY AND ALL UNUSED USAGE CREDITS, WORDS, FEATURES, ETC OF ENDING PLAN.
                                       </div>
                                    </li>
                                    <li className="standardPublicParagraph">
                                        <h2 className="standardPublicH2">Current Billing Information Required.</h2>
                                        <div className="standardPublicParagraph">
                                            User agrees to provide current, complete, and accurate billing information and agree to promptly update all such information (such as changes in billing address, credit card number, or credit card expiration date) as necessary for the processing of all payments that are due to Company. User agrees to promptly notify Company if User's Payment Method is canceled (for example, due to loss or theft) or if User becomes aware of a potential breach of security related to User's Payment Method. If User fails to provide any of the foregoing information, User acknowledges that User's current Payment Method may continue to be charged for Paid Services and that User will remain responsible for all such charges.
                                        </div>
                                    </li>
                                    <li className="standardPublicParagraph">
                                        <h2 className="standardPublicH2">Change in Amount Authorized.</h2>
                                        <div className="standardPublicParagraph">
                                            If the total amount to be charged varies from the amount User authorized when purchasing any Paid Services (other than due to the imposition or change in the amount of taxes, including without limitation sales and use taxes, duties or other governmental taxes or fees), Company will provide notice of the amount to be charged and the date of the charge at least 10 days before the scheduled date of the transaction. If User does not cancel your Paid Services before the increased price goes into effect, User agrees to pay the increased price for the Paid Services. User agrees that Company may accumulate charges incurred and submit them as one or more aggregate charge during or at the end of each billing cycle. Company will inform User of any additional charges which are accumulated.
                                        </div>
                                    </li>
                                    <li className="standardPublicParagraph">
                                        <h2 className="standardPublicH2">Payment Processors.</h2>
                                        <div className="standardPublicParagraph">
                                            Ordering services through the Platform involves utilizing the secured server of a payment processing service provider ("PSP," e.g., Stripe). Neither PSP nor any person or company related to PSP holds any ownership interest in the Platform or Company, nor receives any financial benefit from the Platform or Company other than a fee paid by Company to PSP for the services performed by PSP. Company makes absolutely no representations and/or warranties, and provides no assurances, regarding the PSP, the PSP owner, or the quality, availability, legality, or description of the payment processing services offered thereon. COMPANY EXPRESSLY DISCLAIMS ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, OR FITNESS FOR A PARTICULAR PURPOSE WITH RESPECT TO THE PSP AND/OR THE SERVICES OFFERED THEREON.
                                        </div>
                                    </li>
                                </ol>
                            </li>
                            <li className="mt-2">
                                <h2 className="standardPublicH2">API Usage.</h2>
                                <ol type="i" className="standardPublicParagraph">
                                    <li className="standardPublicParagraph">
                                        <div className="standardPublicParagraph">
                                            SalesDoing may, in its sole discretion, set limits on User's API usage including, without limitation, limits on the frequency with which User's requests are processed. SalesDoing may change such usage limits at any time, and/or may utilize technical measures to prevent over-usage and/or stop usage of the APIs by an application after any usage limitations are exceeded
                                        </div>
                                    </li>
                                    <li className="standardPublicParagraph">
                                        <div className="standardPublicParagraph">
                                            The term "Brand Features" shall mean SalesDoing's trade names, trademarks, service marks, logos (e.g., the SalesDoing robot logo), domain names, and other distinctive brand features. User agrees only to use SalesDoing's word mark SalesDoing, if at all, factually and in connection with User's implementation of the API in User's application or product. User shall not use any other Brand Feature in any other way. User shall not modify or alter any Brand Feature or use them in a confusing way, including suggesting sponsorship or endorsement by SalesDoing, or in a way that confuses SalesDoing with another brand.
                                        </div>
                                    </li>
                                </ol>
                            </li>
                        </ol>
                    </li>
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Proprietary Rights.</h2>
                        <div className="standardPublicParagraph">All rights and permissions not expressly granted herein are reserved by SalesDoing.</div>
                        <ol type="a" className="standardPublicParagraph">
                            <li className="standardPublicParagraph">
                                <div className="standardPublicParagraph">
                                    For the term of this Agreement, and unless as otherwise agreed by SalesDoing in writing, SalesDoing grants User a limited, revocable, non-exclusive, non-transferable, non-assignable, non-sublicensable right and license to use, for User's personal and non-commercial purposes, the Platform and any API guidelines solely provided that User adheres to all of the terms and conditions of this Agreement. The foregoing is an express limited use license and not an assignment, sale, or other transfer of the Platform or any patents, copyrights, trade secrets, moral rights, trademarks, know-how, or any related or other rights or interests or other intangible assets recognized under any laws, regulations, or international conventions, in any country or jurisdiction in the world (collectively, "Intellectual Property Rights") of SalesDoing or its licensors. Subject to the prohibitions of Section 6, any rights not expressly licensed pursuant to this section are reserved and upon termination of this Agreement, all rights which are licensed shall terminate.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <div className="standardPublicParagraph">
                                    User hereby grants SalesDoing an unlimited, irrevocable, non-exclusive, transferable, assignable, sublicensable right and license to use the Submissions for any purpose including, without limitation, developing the SalesDoing™ technology, providing tailored Platform experiences to User, and generating the Output. The non-exclusive license hereby granted to SalesDoing under this Section will extend to any associated Intellectual Property Rights in the Submissions and will continue in perpetuity, notwithstanding the termination of this Agreement.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <div className="standardPublicParagraph">
                                    To the fullest extent permitted by law, SalesDoing will own all rights, title, and interest in the Output including, without limitation, all Intellectual Property Rights therein. SalesDoing hereby grants to User a limited, revocable, non-exclusive, transferable, assignable, sublicensable right and license to use the Output, and Intellectual Property rights which may be contained therein, for User's own purposes.
                                </div>
                            </li>
                        </ol>
                    </li>
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Platform Prohibitions.</h2>
                        <div className="standardPublicParagraph">
                            User agrees that it may NOT: (a) use the Platform or any content or information available through the Platform for any unauthorized purpose including, without limitation, exceeding Submission limitations and acting beyond the scope of paid services; (b) interfere with or damage the Platform including, without limitation, through the use of viruses, spyware, malware, harmful code, flood pings, denial of service attacks, packet or IP spoofing, forged routing, or methods that in any way reproduce or circumvent the navigational structure or presentation of the Platform; (c) use the Platform to collect, store, or distribute any information about any other person; (d) use to Platform to send or store infringing, obscene, threatening, libelous, or otherwise unlawful or tortious material, including material harmful to children or in violation of third-party privacy rights; (e) use the Platform to impersonate any person, company, or entity; (f) modify, sublicense, assign, give, transfer, translate, sell, resell, reverse engineer, decipher, decompile, or otherwise disassemble any code, data, content, or information available through the Platform or any software components used on or for the Platform or access thereto; (g) attempt to gain unauthorized access to the Platform or its related systems or networks; (h) use any third-party software or scripts to collect information from or through the Platform; (i) distribute, re-distribute, or permit transfer of the Platform or content or information available through the Platform in violation of any export or import law and/or regulation or restriction of the United States of America and its agencies or authorities, or without all required approvals, licenses or exemptions; (j) use the Platform to disseminate, store, or transmit unsolicited messages, chain letters, or unsolicited commercial e-mail; (k) use the Platform to disseminate, store, or transmit files, graphics, software or other material that actually, impliedly, or potentially infringes the copyright, trademark, patent, trade secret, trade name or other Intellectual Property Right of any person, entity, partnership, organization, association or otherwise; (l) adapt, translate, or create any derivative works of the Platform or merge the Platform into any other software; (m) use the Platform to display or promote spyware, adware, spam, or other malicious programs or code, counterfeit goods, items subject to US embargo, hate materials or materials urging acts of terrorism or violence, goods made from protected animal/plant species, recalled goods, any hacking, surveillance, interception, or descrambling equipment, illegal drugs and paraphernalia, unlicensed sale of prescription drugs and medical devices, the sale of tobacco or alcohol to persons under twenty-one (21) years of age, pornography, prostitution, body parts and bodily fluids, stolen products and items used for theft, fireworks, explosives, and hazardous materials, government IDs, police items, unlicensed trade or dealing in stocks and securities, gambling items, professional services regulated by state licensing regimes, non-transferable items such as airline tickets or event tickets, non-packaged food items, or weapons and accessories; (n) use the Platform to create, train, or improve (directly or indirectly) a similar product, service, or platform, including any other machine learning algorithms or machine translation or paraphrasing system; (o) use or retain translated text or any other Platform data for the purpose of creating, training, or improving (directly or indirectly) a translation service, product, or platform, including any other machine learning algorithms or machine translation or paraphrasing system; (p) display or make available, publicly, more than 300,000 characters of Platform output or Platform input and output in proximate comparative fashion (e.g., side-by-side); (q) unless otherwise agreed by SalesDoing and User in writing, use the Platform to augment datasets to improve natural language processing systems; or (r) assist any third-party in doing any of the foregoing.
                        </div>
                    </li>
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Security of User's System.</h2>
                        <div className="standardPublicParagraph">
                            User shall be solely responsible for the security, confidentiality, and integrity of all content that User receives, transmits through or stores via the Platform or on any computer, mobile device, or related equipment that is used to access the Platform.
                        </div>
                    </li> 
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Term and Termination.</h2>
                        <div className="standardPublicParagraph">
                            This Agreement remains effective from the moment User accesses or uses the Platform until terminated. This Agreement will terminate automatically without notice from the SalesDoing if User fails to comply with any provision of this Agreement. SalesDoing reserves the right, in its sole discretion and without prior notice to User, at any time and for any reason, to: (i) remove or disable access to all or any portion of the Platform; (ii) suspend User's access to or use of all or any portion of the Platform; and (iii) terminate this Agreement.
                        </div>
                    </li>      
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Links.</h2>
                        <div className="standardPublicParagraph">
                            The Platform may contain links to other Internet sites and resources, and User hereby acknowledges and agrees that: (i) SalesDoing shall not be responsible for the availability of such external sites or resources; and (ii) SalesDoing does not endorse and is not responsible or liable for any content, advertising, products, or other materials on or available from such websites or resources. User agrees that SalesDoing shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of, or reliance upon, any such content, goods or services available on or through any such website or resource.
                        </div>
                    </li>      
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Limited Liability.</h2>
                        <ol type="a" className="standardPublicParagraph">
                            <li className="standardPublicParagraph">
                                <div className="standardPublicParagraph">
                                SalesDoing, ITS AFFILIATES, SUBSIDIARIES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, LICENSORS, SUCCESSORS, OR ASSIGNS ("SalesDoing PARTIES") SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES ARISING FROM OR RELATING TO: (I) THE PLATFORM'S AVAILABILITY; (II) THE ACTS, OMISSIONS, OR CONDUCT OF ANY USER OR THIRD-PARTY, WHETHER ONLINE OR OFFLINE; (III) ANY PLATFORM CONTENT; (IV) ANY GOODS OR SERVICES ACQUIRED AS A RESULT OF ANY INFORMATION OBTAINED OR TRANSACTIONS ENTERED INTO THROUGH THE PLATFORM; OR (V) ANY USE OF GOODS OR SERVICES MADE AVAILABLE ON ANY INTERNET RESOURCE OR WEBPAGE LINKED TO THE PLATFORM. THE SalesDoing PARTIES SHALL NOT BE HELD RESPONSIBLE FOR TECHNICAL MALFUNCTIONS OF ANY TELEPHONE SYSTEM, CELLULAR NETWORK, CABLE SYSTEM, COMPUTER EQUIPMENT, SERVER, PROVIDER, OR SOFTWARE. THE SalesDoing PARTIES SHALL NOT BE HELD RESPONSIBLE FOR ANY INJURY OR DAMAGE TO USER'S COMPUTER OR EQUIPMENT RESULTING FROM ACCESS TO OR USE OF THE PLATFORM INCLUDING, BUT NOT LIMITED TO, WEB PAGE VIEWING, FILE DOWNLOADING OR STREAMING, SERVER USE OR ACCESS, OR FOLLOWING PLATFORM LINKS. USER ACCESSES THE PLATFORM AT HIS/HER OWN RISK AND IS SINGULARLY RESPONSIBLE FOR ANY LOSS, DAMAGE, OR COSTS INCURRED DURING SUCH ACTIVITY. THE SalesDoing PARTIES SHALL NOT BE RESPONSIBLE FOR ANY INCORRECT OR INACCURATE CONTENT POSTED ON OR RECEIVED FROM THE PLATFORM, REGARDLESS OF THE CAUSE OF SUCH INACCURACY. THE SalesDoing PARTIES SHALL NOT BE RESPONSIBLE FOR ANY CONDUCT OF ANY USER OF THE PLATFORM. THE SalesDoing PARTIES SHALL NOT BE RESPONSIBLE FOR ANY ERROR, OMISSION, INTERRUPTION, DELETION, DEFECT, OPERATIONAL DELAY, COMMUNICATION LINE FAILURE, OR THEFT, BREACH, DESTRUCTION, OR ALTERATION OF USER'S COMMUNICATION. NO DATA OR INFORMATION OBTAINED FROM THE SalesDoing PARTIES SHALL CREATE ANY WARRANTY.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <div className="standardPublicParagraph">
                                    THE SalesDoing PARTIES' AGGREGATE LIABILITY TO USER OR ANY THIRD-PARTY, IN ANY MATTER ARISING FROM OR RELATED TO THE PLATFORM OR THE AGREEMENT, SHALL NOT EXCEED THE SUM OF TEN DOLLARS ($10.00).
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <div className="standardPublicParagraph">
                                    USER'S ACCESS OR USE OF ANY THIRD-PARTY INTERNET RESOURCE LINKED TO OR FROM THE SOFTWARE, OR USER'S USE OF GOODS OR SERVICES FROM THIRD-PARTY INTERNET RESOURCES LINKED TO OR FROM THE SOFTWARE, IS MADE AT USER'S OWN RISK. USER HEREBY RELEASES THE SalesDoing PARTIES FROM ANY DAMAGES USER SUFFERS FROM USER'S ACCESS TO THIRD-PARTY INTERNET RESOURCES, AND USER AGREES NOT TO MAKE ANY CLAIMS AGAINST THE SalesDoing PARTIES ARISING FROM ANY PURCHASE OR ACQUISITION OF GOODS AND SERVICES MADE AVAILABLE THROUGH THE PLATFORM OR THROUGH THIRD-PARTY INTERNET RESOURCES.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <div className="standardPublicParagraph">
                                    THE SalesDoing PARTIES SHALL NOT BE LIABLE FOR ANY DAMAGES RESULTING FROM THE FAILURE, BY ANY PARTY, TO PROTECT USER PASSWORDS OR ACCOUNT INFORMATION. THE SalesDoing PARTIES SHALL NOT BE LIABLE FOR ANY FAILURE OR PERFORMANCE DELAY UNDER THE AGREEMENT DUE TO CIRCUMSTANCES BEYOND THE SalesDoing PARTIES' CONTROL INCLUDING, BUT NOT LIMITED TO, NATURAL CATASTROPHES, GOVERNMENTAL ACTS, LAWS OR REGULATIONS, TERRORISM, LABOR STRIKES OR DIFFICULTIES, COMMUNICATION SYSTEM INTERRUPTIONS, HARDWARE OR SOFTWARE FAILURES, TRANSPORTATION INTERRUPTIONS, OR ANY INABILITY TO ACQUIRE MATERIALS OR SUPPLIES. THE SalesDoing PARTIES SHALL NOT BE LIABLE FOR ANY ILLEGAL, ABUSIVE, OR OTHERWISE INAPPROPRIATE ACTIVITY PERFORMED BY USER INCLUDING, WITHOUT LIMITATION, USING THE PLATFORM TO INFRINGE THE COPYRIGHT OR OTHER INTELLECTUAL PROPERTY RIGHT(S) OF ANOTHER. THE SalesDoing PARTIES SHALL NOT BE LIABLE FOR COMPLIANCE OR LACK THEREOF BY ANY THIRD-PARTY VENDORS WITH RESPECT TO ANY APPLICABLE LAWS AND REGULATIONS.
                                </div>
                            </li>
                        </ol>
                    </li>
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Indemnification.</h2>
                        <ol type="a" className="standardPublicParagraph">
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Occurrence.</h2>
                                <div className="standardPublicParagraph">
                                    User agrees to defend the SalesDoing Parties to the fullest extent permitted by law, against any and all claims, demands and/or actions and indemnify and hold the SalesDoing Parties harmless from and against any and all losses, damages, costs and expenses, including reasonable attorney's fees, (each a "Claim), regardless of whether such Claim is due to a SalesDoing Party's active or passive negligence, arising out of or relating to: (i) any User breach of any provision of this Agreement and/or any representation or warranty identified herein; (ii) User's use of the Platform, including any data or information transmitted or received by User; (iii) any unacceptable use of the Platform by User including, without limitation, any statement, data or content made, transmitted, or republished by User which is infringing or otherwise prohibited as unacceptable in Section 6; or (iv) any expenses SalesDoing incurs in enforcing this Section including, without limitation, reasonable attorney's fees and costs.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Procedures.</h2>
                                <div className="standardPublicParagraph">
                                    SalesDoing will promptly notify User of any claim or action with respect to any claim for indemnification hereunder, and User will undertake the defense or settlement and all related costs and expenses of any claim or action for which it has an indemnification obligation. User will have the right to settle or compromise any action to which its indemnification is applicable, except that User may not agree to any settlement without the prior written consent of SalesDoing if such settlement would cause SalesDoing to undertake any action, assume any liability, pay any monies, or acknowledge any wrongdoing or have a judgment entered against it. Notwithstanding the foregoing, SalesDoing will have the right to undertake the defense of any claim asserted against it at User's expense in the event that: (i) User fails to assume the defense of such claim; (ii) SalesDoing reasonably determines that an adverse outcome could be material to SalesDoing's business; (iii) there are conflicts between User's and SalesDoing's interests in such litigation; or (iv) SalesDoing reasonably believes that User does not have the financial resources needed to satisfy its indemnification obligation in the event of an adverse outcome.
                                </div>
                            </li>
                        </ol>
                    </li> 
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">SalesDoing Privacy Policy.</h2>
                        <div className="standardPublicParagraph">
                            User agrees to accept SalesDoing's Privacy Policy, available at <Link to="/privacy">https://SalesDoing.com/privacy</Link>.
                        </div>
                        <ol type="a" className="standardPublicParagraph">
                            
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Take-Down Requests, DMCA.</h2>
                                <div className="standardPublicParagraph">
                                    SalesDoing expressly prohibits users from uploading, posting, or otherwise distributing through the Platform any content which may violate another party's Intellectual Property Rights, privacy, publicity, or other rights. If any User believes any Platform content violates or otherwise infringes upon any of User's rights, User is encouraged to contact SalesDoing immediately to request that the allegedly offending content ("Offending Content") to be removed from the Platform. To make such a request ("Take-Down Request"), User should email support@SalesDoing.com
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <div className="standardPublicParagraph">User's name, mailing address, email address, and telephone number; and</div>
                            </li>
                            <li className="standardPublicParagraph">
                                <div className="standardPublicParagraph">
                                    the name, user id, email, telephone phone number, and mailing address of the person User believes posted the Offending Content (as available).
                                </div>
                                <div className="standardPublicParagraph">
                                    In accordance with the Digital Millennium Copyright Act ("DMCA"), SalesDoing has designated a Copyright Agent who is charged with receiving notification of alleged copyright violations and may accept notification of other offending Platform content. If User believes in good faith that material appearing on this website infringes its copyright, 
                                </div>
                                <div className="standardPublicParagraph">
                                    Similarly, the DMCA provides that if one, in good faith, believe that a notice of copyright infringement has been wrongfully filed against him, he may send to our Copyright Agent a counter notice, subject to the requirements set forth in 17 U.S.C. § 512(g)(3).
                                </div>
                                <div className="standardPublicParagraph">
                                    Lastly, it should be noted that individuals making misrepresentations made in alleging that material appearing on this website constitutes copyright infringement may be liable for damages pursuant to 17 U.S.C. § 512(f). SalesDoing will process proper Take-Down Requests, will promptly remove or disable access to any offensive or infringing content, and will terminate the accounts of repeat infringers.
                                </div>
                            </li>
                        </ol>
                    </li>   
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Dispute Resolution Protocol.</h2>
                        <ol type="a" className="standardPublicParagraph">
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Controlling Law and Jurisdiction.</h2>
                                <div className="standardPublicParagraph">
                                    This Agreement will be interpreted in accordance with the laws of the State of Illinois and the United States of America, without regard to its conflict-of-law provisions. User and SalesDoing agree to submit to the personal jurisdiction of the state and federal courts located within Cook County, Illinois, for any actions involving actual or threatened infringement, misappropriation, or violation of a party's copyrights, trademarks, trade secrets, patents, or other intellectual property rights, or User's outstanding payment of fees due hereunder.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Negotiations.</h2>
                                <div className="standardPublicParagraph">
                                    In the event any dispute arises except those disputes the involving actual or threatened infringement, misappropriation, or violation of a party's Intellectual Property Rights, User and SalesDoing agree to first attempt to negotiate the resolution any dispute, informally for at least thirty (30) days before initiating any arbitration or court proceeding.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Other parties.</h2>
                                <div  className="standardPublicParagraph">
                                    User accept that, as a corporation, SalesDoing has an interest in limiting the personal liability of its officers and employees. User agrees that it will not bring any claim personally against SalesDoing's officers or employees in respect of any losses User suffers in connection with the Platform. Without prejudice to the foregoing, User agree that the limitations of warranties and liability set out in this Agreement will protect SalesDoing's officers, employees, agents, subsidiaries, successors, assigns, and sub-contractors as well as SalesDoing.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Binding Arbitration.</h2>
                                <div className="standardPublicParagraph">
                                    All claims arising from use of the Platform (except those disputes involving actual or threatened infringement, misappropriation, or violation of a party's copyrights, trademarks, trade secrets, patents, or other intellectual property rights, or User's outstanding payment of fees due hereunder) will be finally and exclusively resolved by binding arbitration. Any election to arbitrate by one party will be final and binding on the other. User understands that if either party elects to arbitrate, neither party will have the right to sue in court or have a jury trial. The arbitration will be commenced and conducted under the Commercial Arbitration Rules of the American Arbitration Association ("AAA") and, where appropriate, the AAA's Supplementary Procedures for Consumer Related Disputes both of which are available at the AAA website <Link to="https://www.adr.org">https://www.adr.org</Link>. The Parties will submit briefs of no more than 10 pages and the arbitration hearing will be limited to two (2) days maximum. The arbitrator must apply Illinois law and any award may be challenged if the arbitrator fails to do so. Unless otherwise agreed by the Parties, arbitration will take place in Chicago, Illinois. User's arbitration fees and User's share of arbitrator compensation will be governed by the AAA Rules and, where appropriate, limited by the AAA Consumer Rules. If User's claim for damages does not exceed $10,000, SalesDoing will pay User's share of arbitration fees unless the arbitrator finds that either the substance of User's claim or the relief sought was frivolous or brought for an improper purpose as determined pursuant to Federal Rule of Civil Procedure 11(b). The arbitration may be conducted in person, through the submission of documents, by phone or online. The arbitrator will make a decision in writing. The Parties may litigate in court to compel arbitration, stay proceeding pending arbitration, or to confirm, modify, vacate or enter judgment on the award entered by the arbitrator.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">WAIVER OF RIGHT TO BE A PLAINTIFF OR CLASS MEMBER.</h2>
                                <div className="standardPublicParagraph">
                                    USER AND SalesDoing AGREE THAT ANY ARBITRATION WILL BE LIMITED TO THE DISPUTE BETWEEN SalesDoing AND USER INDIVIDUALLY. USER ACKNOWLEDGES AND AGREES THAT USER AND SalesDoing ARE EACH WAIVING THE RIGHT TO PARTICIPATE AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS ACTION OR REPRESENTATIVE PROCEEDING. THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE USER'S CLAIMS AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF ANY CLASS OR REPRESENTATIVE PROCEEDING.
                                </div>
                            </li>
                        </ol>
                    </li>
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Miscellanea.</h2>
                        <ol type="a" className="standardPublicParagraph">
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Waiver; Remedies Cumulative.</h2>
                                <div className="standardPublicParagraph">
                                    To the maximum extent permitted by applicable law: (i) no claim or right arising out of this Agreement or any of the documents referred to in this Agreement can be discharged by a Party, in whole or in Part, by a waiver or renunciation of the claim or right unless in writing signed by such Party; (ii) no waiver that may be given by a Party will be applicable except in the specific instance for which it is given; and (iii) no notice to or demand on one Party will be deemed to be a waiver of any obligation of that Party or of the right of the Party giving such notice or demand to take further action without notice or demand as provided in this Agreement.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Entire Agreement and Modification.</h2>
                                <div className="standardPublicParagraph">
                                    This Agreement constitutes the complete and exclusive statement of the agreement between the Parties with respect to the Platform and supersedes any and all prior or contemporaneous communications, representations, statements and understandings, whether oral or written, between the Parties concerning the Platform. This Agreement may be modified by SalesDoing and User may agree in writing.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Severability.</h2>
                                <div className="standardPublicParagraph">
                                    If any provision of this Agreement is held invalid or unenforceable by any court of competent jurisdiction, the other provisions of this Agreement will remain in full force and effect. Any provision of this Agreement held invalid or unenforceable only in part or degree will remain in full force and effect to the extent not held invalid or unenforceable.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Remedies.</h2>
                                <div className="standardPublicParagraph">
                                    The rights granted by SalesDoing herein are of a special, unique, and intellectual nature, which gives them a peculiar value, the loss of which cannot be reasonably or adequately compensated for in damages in an action at law. In addition, User acknowledges that during the course of accessing or using the Platform, User will or may have access to SalesDoing's proprietary information, including, without limitation, Platform code and related materials. Accordingly, the breach by User of the provisions of this Agreement concerning SalesDoing's proprietary rights will cause SalesDoing irreparable injury and damage for which SalesDoing will be entitled, without posting any bond or security, to seek injunctive or other equitable relief. The granting of equitable relief will not be construed as a waiver of any other rights of SalesDoing in law or in equity. User agrees that the rights and remedies of User in the event of a breach of this Agreement by SalesDoing shall be limited to the right to recover damages, if any, in an action at law, and in no event shall User be entitled to terminate or rescind this Agreement or enjoin or restrain SalesDoing's use or exploitation of the Submissions.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Assignment.</h2>
                                <div className="standardPublicParagraph">
                                    SalesDoing may assign any of its rights or delegate any of its obligations hereunder to any person or entity at any time without User's consent. User may not assign any of its rights or delegate any of its obligations hereunder to any person or entity without the prior written consent of SalesDoing. Subject to the preceding sentence, this Agreement will apply to, be binding in all respects upon, and inure to the benefit of the successors and permitted assigns of the parties. Nothing expressed or referred to in this Agreement will be construed to give any person other than the parties to this Agreement any legal or equitable right, remedy, or claim under or with respect to this Agreement or any provision of this Agreement, except such rights as will inure to a successor or permitted assignee pursuant to this Section.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">California Consumer Complaints.</h2>
                                <div className="standardPublicParagraph">
                                    Pursuant to Cal. Civ. Code. § 1789.3, user complaints or requests for further information may be sent to support@SalesDoing.com. The Complaint Assistance Unit of the Division of Consumer Services of the Department of Consumer Affairs may be reached at 1625 North Market Blvd., Suite N 112 Sacramento, CA 95834 (800) 952-5210.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Survival.</h2>
                                <div className="standardPublicParagraph">
                                    Sections 3, 5-6, 10-11, and 14-15 shall survive the termination of this Agreement.
                                </div>
                            </li>
                        </ol>
                        <div className="standardPublicParagraph">
                            Terms of Service &copy; 2026 SalesDoing, Inc.
                        </div>
                    </li> 
                </ol>
            </div>
            <Footer />
        </>
    );
}

export default Terms;