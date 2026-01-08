import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../Core/hooks';
import Footer from '../../Components/Footer';
import Navigation from '../../Components/Navigation';
import RedirectToDash from '../../Components/RedirectToDash';

function Privacy() {

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
                        Privacy
                    </h1>
                </div>
            </div>
            <div className="standardPublicPage60">
                <div className="standardPublicParagraph">
                    SalesDoing, Inc. ("SalesDoing) respects and values its Users' privacy. This Privacy Policy describes the information SalesDoing collects from Users when they visit www.SalesDoing.com (the "Website"), how SalesDoing uses that information, and under what circumstances SalesDoing may or does disclose that information. This Privacy Policy should be read in conjunction with the <Link to="/">SalesDoing.com</Link> Terms of Service also available on the Website at SalesDoing.com
                </div>

                <ol className="standardPublicParagraph">
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Changes to Privacy Policies.</h2>
                        <div className="standardPublicParagraph">
                            SalesDoing's Privacy Policy is subject to change from time to time, so SalesDoing suggests that User reviews the current Privacy Policy at the start of each visit to the Website. Unless SalesDoing clearly expresses otherwise, SalesDoing will use information in accordance with the Privacy Policy under which User Information, as defined below, was collected, and User accepts and agrees to SalesDoing's practices as described herein. USER IS HEREBY ADVISED THAT USER'S CONTINUED USE OF THE WEBSITE CONSTITUTES USER'S ACCEPTANCE OF ANY AMENDMENTS TO AND THE MOST RECENT VERSION OF THIS PRIVACY POLICY AND THE WEBSITE'S TERMS OF SERVICE.
                        </div>
                    </li>
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Information SalesDoing Collects.</h2>
                        <div className="standardPublicParagraph">
                            When User uses the Website, SalesDoing may receive and collect certain information. The information that SalesDoing may receive and collect depends on what User does when it visits the Website.
                        </div>
                        <ol type="a" className="standardPublicParagraph">
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Automatically Collected Information.</h2>
                                <div className="standardPublicParagraph">
                                    Some information is automatically received and sometimes collected from User when User visits the Website. This information may include some or all of the following items: (i) the name of the domain and host from which User accesses the Internet, including the Internet Protocol (IP) address of the computer User is using and the IP address of User's Internet Service Provider; (ii) the type and version of Internet browser software User uses and its operating system; (iii) the date and time User accesses the Website, the length of User's stay and the specific pages, images, video or forms that User accesses while visiting the site; (iv) the Internet address of the website from which User linked directly to the Website, and if applicable, the search engine that referred User and any search strings or phrases that User entered into the search engine to find the Website; and (v) demographic information concerning the country of origin of User's computer and the language(s) used by it. SalesDoing uses this information to monitor the usage of the Website, assess its performance, ensure technological compatibility with Users' computers, and understand the relative importance of the information provided on the Website. SalesDoing may also use this data to conduct statistical analyses on Users' usage patterns and other aggregated data.
                                </div>  
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Information Collected via Cookies.</h2>
                                <div className="standardPublicParagraph">
                                    "Cookies" are small files or records that are placed on User's computer to distinguish User from other visitors to the Website. The use of cookies is a standard practice among websites to collect or track information about User's activities while using the Website. Generally, a Cookie may enable a website owner to track how a visitor navigates through the website and the areas in which visitors show interest. This is analogous to a traffic report: it tracks trends and behaviors but does not identify individuals. Information gathered in this fashion may include date and time of visits, pages viewed, time spent at the Website, and the website visited just before and just after a visit to the Website. Cookies can be set to expire: (i) on a specified date; (ii) after a specific period of time; (iii) when a transaction has been completed; or (iv) when a User turns off his/her Internet browser. A Cookie that is erased from memory when a visitor's Internet browser closes is called a "session" cookie whereas Cookies which expire based on a time set by the Web server are called "persistent" cookies. The Website may use both "session cookies" and "permanent cookies," as well as session tracking technology (e.g., InspectLet) which analyzes user behavior when on the Website. Internet browsers are typically set to accept Cookies by default. User can choose to have its browser warn User every time a Cookie is being sent to User or User can turn off Cookie placements. If User refuses Cookies, there may be parts of the Website which may not function properly.
                                </div>
                            </li>
                            <li className="standardPublicParagraph">
                                <h2 className="standardPublicH2">Information User May Actively Submit Through the Website.</h2>
                                <div className="standardPublicParagraph">
                                    For some of the browsing on the Website, SalesDoing neither requires nor collects "User Information," which is information communicated by User to SalesDoing generally for use by SalesDoing in contacting User, e.g., User's name and email address. User can browse the Website and take as much time as User wants to review the Website without having to submit such User Information. In the following instances, however and without limitation, User will be required to submit User Information: (i) when User wants to contact SalesDoing via email or Website contact forms; (ii) when User registers an account on the Website; or (iii) as necessary to process transactions entered into via the Website. E-mail or other forms of electronic communication, including contact form submission, are inherently not a secure and/or confidential means of communication. Information that is provided to SalesDoing as a "Submission," as that term is used in the Website Terms of Services, is not "User Information" as that term is used in this Privacy Policy, and SalesDoing may handle Submission information in its sole discretion.
                                </div>
                            </li>
                        </ol>
                    </li>
                    <li>
                        <h2 className="standardPublicH2">Personal Information About Children.</h2>
                        <div className="standardPublicParagraph">
                            The Website is targeted primarily for use by adults. SalesDoing does not target or create special areas for use by children. Accordingly, SalesDoing does not knowingly collect age identifying information, nor does SalesDoing knowingly collect any personal information from children under the age of 13 years. HOWEVER, SalesDoing HEREBY ADVISES ALL VISITORS TO THE WEBSITE UNDER THE AGE OF 13 NOT TO DISCLOSE OR PROVIDE ANY PERSONALLY IDENTIFIABLE INFORMATION ON THE WEBSITE. In the event that SalesDoing discovers that a child under the age of 13 has provided personally identifiable information to SalesDoing, in accordance with the Children's Online Privacy Protection Act (please see the Federal Trade Commission's website at http://www.onguardonline.gov/articles/0031-protecting-your-childs-privacy-online for more information about this Act. SalesDoing will delete the child's personally identifiable information from SalesDoing's files to the extent possible.
                        </div>
                    </li>
                    <li>
                        <h2 className="standardPublicH2">E-Mail Communication.</h2>
                        <div className="standardPublicParagraph">
                            When User sends an email to SalesDoing or provides User's email address to SalesDoing, User is communicating with SalesDoing electronically and consents to receive communication from SalesDoing electronically. SalesDoing may retain the content of such email(s), User's email address, and SalesDoing response(s) in order to further service User's needs. SalesDoing may use the data that User provides to send User email or correspondence via other means.
                        </div>
                    </li>
                    <li>
                        <h2 className="standardPublicH2">How SalesDoing Uses and Shares User Information.</h2>
                        <div className="standardPublicParagraph">
                            SalesDoing may use User Information that User actively submits to better assist User when User visits or contact SalesDoing again and to send User special offers which may be of interest to User. SalesDoing may do this by general marketing communications for the Website or related services, including by e-mail, (collectively, "Marketing Communications"). Unless User "opts-out" through opportunities available to User through SalesDoing's Marketing Communications, SalesDoing may send User Marketing Communications. User may also "opt-out" of future Marketing Communications by following the instructions provided in this Privacy Policy under the "Access to and Managing User Information" section of this Privacy Policy. Except where SalesDoing otherwise obtains User's express permission, SalesDoing may share User Information with third-parties only under the limited circumstances stated below:
                        </div>
                        <ol type="a" className="standardPublicParagraph">
                            <li className="standardPublicParagraph">
                                Information is subject to disclosure in response to judicial or other governmental subpoenas, warrants, and court orders served on SalesDoing in accordance with their terms, as otherwise required by applicable law, or in response to requests by law enforcement.
                            </li>
                            <li className="standardPublicParagraph">
                                Information is subject to disclosure to protect SalesDoing's rights or property, protect its legitimate business interests, to enforce the provisions of SalesDoing's Privacy Policy and Terms of Service, and/or to prevent harm to User or others.
                            </li>
                            <li className="standardPublicParagraph">
                                Information may be disclosed to: (i) carefully selected third-party service providers so that they may provide services to User; (ii) provide customer service; (iii) send or email Marketing Communications; (iv) maintain SalesDoing's promotions, database, and other programs; (v) monitor the activity of the Website; (vi) conduct surveys; and (vii) process transactions.
                            </li>
                            <li className="standardPublicParagraph">
                                Information may be disclosed and transferred if SalesDoing or its business is sold or offered for sale to another company or person(s), if a petition for relief under the United States Bankruptcy Laws is filed by or against us, or if SalesDoing becomes subject to an order of appointment of a trustee or receiver.
                            </li>
                        </ol>
                    </li>
                    <li>
                        <h2 className="standardPublicH2">Linking to Third-Party Websites.</h2>
                        <div className="standardPublicParagraph">
                            When User click on links on the Website that take User to third-party websites, User may be subject to the third-party website's privacy policies. While SalesDoing supports the protection of privacy on the Internet, SalesDoing cannot be responsible for the actions of any third-party websites. SalesDoing encourages User to read the posted privacy policies of any and every website User visits, whether User is linking from the Website or browsing on its own.
                        </div>
                    </li>
                    <li>
                        <h2 className="standardPublicH2">Access to and Managing User Information.</h2>
                        <div className="standardPublicParagraph">
                            SalesDoing believes it is important for User to be able to: (i) find out what Information User has provided to SalesDoing through the Website; (ii) update User Information; and (iii) "opt out" of receiving future SalesDoing Communications. To inquire about User Information, update User Information, or "opt" out of receiving future SalesDoing Communications, User may do one of the following:
                        </div>
                        <ol type="a" className="standardPublicParagraph">
                            <li className="standardPublicParagraph">
                                <div className="standardPublicParagraph">Select the "unsubscribe" or "opt-out" option(s) contained with SalesDoing's emails; or</div>
                            </li>
                            <li className="standardPublicParagraph">
                                <div className="standardPublicParagraph">
                                    Send an e-mail with User's request and current contact information to <b>support@SalesDoing.com</b>. If User sends an e-mail request, User should include its full name and email address, and indicate the specific nature of User's request. If User wants to "opt in" or "opt out" of receiving SalesDoing communications, specifically what type of SalesDoing communication (e.g., e-mail) User wishes to receive or stop receiving. This will ensure SalesDoing identifies User correctly in SalesDoing's systems and accurately processes User's request. SalesDoing will take appropriate steps to implement User's request, but due to production, mailing and system timelines, it may take up to ten (10) business days for e-mails. Until that change takes effect, User may still receive or not receive SalesDoing Communications. "Opting-out" of SalesDoing Communications may prevent SalesDoing from providing certain services which may be necessary for User's use of the Website or services provided thereon.
                                </div>
                            </li>
                        </ol>
                    </li>
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">What User Needs to Do to Protect its Information.</h2>
                        <div className="standardPublicParagraph">
                            User has several options when deciding how it can best protect User Information. One option is simply not to volunteer it. As stated above, this approach would allow User to still visit the Website, although it will prevent User, for example, from utilizing services or materials provided via the Website or providing SalesDoing with User's comments or questions relating to the Website. The Federal Trade Commission's website, www.ftc.gov, also offers useful information about how to protect personally identifiable information provided to a website.
                        </div>
                    </li>
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">What to Do About Suspected Violations of This Privacy Statement.</h2>
                        <div className="standardPublicParagraph">
                            If at any time User believes that SalesDoing has not adhered to the policies and principles set forth in this Privacy Statement, please notify SalesDoing using the contact information provided in Section 7(b). SalesDoing will make all commercially reasonable efforts to promptly respond to such concerns.
                        </div>
                    </li>
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Do-Not-Track.</h2>
                        <div className="standardPublicParagraph">
                            To the extent do-not-track implementations from User's browser(s) prevent or impede the delivery of services provided through SalesDoing.com, those do-not-track implementations are not honored.
                        </div>
                    </li>
                    <li className="standardPublicParagraph">
                        <h2 className="standardPublicH2">Questions or Comments.</h2>
                        <div className="standardPublicParagraph">
                            If User have any questions or comments concerning SalesDoing's Privacy Policy, please contact SalesDoing using the information provided in Section 7(b).
                        </div>
                    </li>
                </ol>
                <div className="standardPublicParagraph">Privacy Policy &copy; 2026 SalesDoing, Inc.</div>
            </div>
            <Footer />
        </>
    );
}

export default Privacy;