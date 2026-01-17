"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function TermsOfServicePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            setIsMenuOpen(false);
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative w-full bg-white">
                <Header
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    scrollToSection={scrollToSection}
                />

                {/* Content Container */}
                <div className="flex flex-col items-center px-6 pt-[88px] pb-16">
                    <div className="w-full max-w-[800px]">
                        {/* Terms of Service Section */}
                        <section>
                            {/* Title */}
                            <h1 className="text-[#161818] text-2xl font-semibold leading-[1.275] mb-4">
                                Terms of Service
                            </h1>

                            {/* Last Updated */}
                            <p className="text-[#414747] text-lg font-medium leading-normal mb-4">
                                Last updated: December 10th, 2025
                            </p>

                            {/* Introduction */}
                            <p className="text-[#161818] text-lg font-normal leading-normal mb-8">
                                Welcome to ReachiWell. By accessing or using our website, chatbot, or services (collectively, the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
                            </p>

                            {/* Sections */}
                            <div className="flex flex-col gap-8">
                                {/* Section 1 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        1. Use of the Service
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal mb-2">
                                        ReachiWell provides an AI-powered health navigation tool designed to offer general guidance, care options, and transport coordination.
                                        The Service is intended for informational purposes only and does not replace professional medical advice, diagnosis, or treatment.
                                    </p>
                                </div>

                                {/* Section 2 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        2. Eligibility
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal">
                                        You must be at least 18 years old or have permission from a parent or legal guardian to use this Service.
                                    </p>
                                </div>

                                {/* Section 3 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        3. User Responsibilities
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal mb-2">
                                        You agree to:
                                    </p>
                                    <ul className="list-disc list-inside text-[#161818] text-base font-normal leading-normal space-y-2 ml-4">
                                        <li>Provide accurate and truthful information</li>
                                        <li>Use the Service only for lawful purposes</li>
                                        <li>Not misuse, disrupt, or attempt to gain unauthorized access to the Service</li>
                                    </ul>
                                </div>

                                {/* Section 4 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        4. Medical Disclaimer
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal mb-2">
                                        ReachiWell does not provide medical diagnoses. Any recommendations are based on the information you provide and should be confirmed with a qualified healthcare professional.
                                    </p>
                                    <p className="text-[#161818] text-base font-normal leading-normal">
                                        If you are experiencing a medical emergency, call local emergency services immediately.
                                    </p>
                                </div>

                                {/* Section 5 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        5. Privacy
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal">
                                        Your use of the Service is subject to our Privacy Policy, which explains how we collect, use, and protect your information.
                                    </p>
                                </div>

                                {/* Section 6 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        6. Third-Party Services
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal">
                                        The Service may link to or integrate with third-party providers such as clinics, pharmacies, transport services, or communication platforms. ReachiWell is not responsible for the availability, quality, or actions of these third parties.
                                    </p>
                                </div>

                                {/* Section 7 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        7. Limitation of Liability
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal">
                                        To the maximum extent permitted by law, ReachiWell shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.
                                    </p>
                                </div>

                                {/* Section 8 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        8. Changes to the Service
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal">
                                        We may update, modify, or discontinue any part of the Service at any time without notice.
                                    </p>
                                </div>

                                {/* Section 9 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        9. Termination
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal">
                                        We reserve the right to suspend or terminate access to the Service if these Terms are violated.
                                    </p>
                                </div>

                                {/* Section 10 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        10. Governing Law
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal">
                                        These Terms are governed by the laws of [Jurisdiction], without regard to conflict of law principles.
                                    </p>
                                </div>

                                {/* Section 11 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        11. Contact
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal mb-2">
                                        If you have questions about these Terms, please contact us at:
                                    </p>
                                    <a
                                        href="mailto:info@reachiwell.ca"
                                        className="text-[#E87954] text-base font-normal leading-normal hover:underline"
                                    >
                                        info@reachiwell.ca
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Privacy Policy Section */}
                        <section id="privacy-policy" className="mt-16 pt-16">
                            {/* Privacy Policy Title */}
                            <h2 className="text-[#161818] text-2xl font-semibold leading-[1.275] mb-4">
                                Privacy Policy
                            </h2>

                            {/* Last Updated */}
                            <p className="text-[#414747] text-lg font-medium leading-normal mb-4">
                                Last updated: December 10th, 2025
                            </p>

                            {/* Introduction */}
                            <p className="text-[#161818] text-lg font-normal leading-normal mb-8">
                                ReachiWell respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website, chatbot, and related services (the &quot;Service&quot;).
                            </p>

                            {/* Privacy Policy Sections */}
                            <div className="flex flex-col gap-8">
                                {/* Section 1 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        1. Information We Collect
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal mb-2">
                                        We may collect the following types of information:
                                    </p>
                                    <ul className="list-disc list-inside text-[#161818] text-base font-normal leading-normal space-y-2 ml-4">
                                        <li>Personal information such as your name, email address, phone number, or postal code</li>
                                        <li>Information you choose to share in the chatbot, including symptoms or care-related questions</li>
                                        <li>Basic usage data to help us improve the Service</li>
                                    </ul>
                                </div>

                                {/* Section 2 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        2. How We Use Your Information
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal mb-2">
                                        We use your information to:
                                    </p>
                                    <ul className="list-disc list-inside text-[#161818] text-base font-normal leading-normal space-y-2 ml-4">
                                        <li>Provide and improve our services</li>
                                        <li>Help you find relevant care options and resources</li>
                                        <li>Communicate important updates or reminders (with your consent)</li>
                                        <li>Maintain security and prevent misuse</li>
                                    </ul>
                                </div>

                                {/* Section 3 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        3. Health Information Disclaimer
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal">
                                        Any health-related information you provide is used solely to offer guidance and navigation support. ReachiWell does not store or use this information for medical diagnosis or treatment.
                                    </p>
                                </div>

                                {/* Section 4 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        4. Sharing Your Information
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal mb-2">
                                        We do not sell your personal information. We may share limited information with trusted third parties only when necessary to:
                                    </p>
                                    <ul className="list-disc list-inside text-[#161818] text-base font-normal leading-normal space-y-2 ml-4">
                                        <li>Connect you with healthcare providers or transport services</li>
                                        <li>Operate and maintain the Service</li>
                                        <li>Comply with legal obligations</li>
                                    </ul>
                                </div>

                                {/* Section 5 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        5. Data Security
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal">
                                        We take reasonable measures to protect your information from unauthorized access, loss, or misuse. However, no system is completely secure.
                                    </p>
                                </div>

                                {/* Section 6 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        6. Your Choices
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal mb-2">
                                        You may:
                                    </p>
                                    <ul className="list-disc list-inside text-[#161818] text-base font-normal leading-normal space-y-2 ml-4">
                                        <li>Opt out of non-essential communications at any time</li>
                                        <li>Request access to or deletion of your personal information</li>
                                        <li>Stop using the Service at your discretion</li>
                                    </ul>
                                </div>

                                {/* Section 7 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        7. Cookies & Analytics
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal">
                                        We may use cookies or similar technologies to understand how users interact with our Service and to improve functionality. You can control cookie preferences through your browser settings.
                                    </p>
                                </div>

                                {/* Section 8 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        8. Children&apos;s Privacy
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal">
                                        The Service is not intended for children under the age of 13 without parental consent.
                                    </p>
                                </div>

                                {/* Section 9 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        9. Changes to This Policy
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal">
                                        We may update this Privacy Policy from time to time. Changes will be reflected on this page with an updated date.
                                    </p>
                                </div>

                                {/* Section 10 */}
                                <div>
                                    <h2 className="text-[#161818] text-lg font-medium leading-normal">
                                        10. Contact Us
                                    </h2>
                                    <p className="text-[#161818] text-base font-normal leading-normal mb-2">
                                        If you have questions or concerns about this Privacy Policy, please contact us at:
                                    </p>
                                    <a
                                        href="mailto:privacy@reachiwell.ca"
                                        className="text-[#E87954] text-base font-normal leading-normal hover:underline"
                                    >
                                        privacy@reachiwell.ca
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
}

