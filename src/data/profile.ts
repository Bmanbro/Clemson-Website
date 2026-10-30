export const profile = {
  name: "Bryson Newman",
  intro:
    "I'm a computer science student at Clemson University and an offensive security intern. I test web applications, investigate security findings, and lead firewall operations for Clemson's Cyber Defense Team.",
  email: "BrysonNewman@proton.me",
  phone: "+1-864-327-6635",
  github: "https://github.com/bmanbro",
  linkedin: "https://www.linkedin.com/in/newmanb/",
  pdf: "/documents/Bryson-Newman-Resume.pdf",
  education: {
    school: "Clemson University",
    degree: "B.S. in Computer Science",
    minor: "Minor in Cybersecurity",
    graduation: "Expected May 2027",
    gpa: "3.61 / 4.00",
  },
  jobs: [
    {
      title: "Offensive Security Analyst Intern",
      org: "Clemson Cybersecurity Operations Center",
      dates: "May 15, 2026 – Present",
      bullets: [
        "Test web applications with Burp Suite, OWASP ZAP, and Gobuster to identify vulnerabilities, exposed resources, insecure configurations, and potential attack paths.",
        "Use Metasploit in controlled environments to validate known vulnerabilities and assess their impact and remediation priorities.",
        "Analyze DAST findings, including Invicti results, and validate reported vulnerabilities.",
      ],
    },
    {
      title: "Security Analyst Intern",
      subtitle: "Tier 2 Firewall Operations",
      org: "Clemson Cybersecurity Operations Center",
      dates: "May 15, 2025 – May 1, 2026",
      bullets: [
        "Investigated and triaged 9,000+ security alerts, reduced false positives, and supported timely threat remediation.",
        "Worked with analysts to defend 25,000+ faculty and student accounts against phishing, brute-force logins, and compromised credentials.",
        "Investigated endpoint and email activity using Splunk, Microsoft Defender, and Abnormal Security.",
        "Reviewed firewall logs for suspicious activity, potential breaches, and compliance issues.",
      ],
    },
    {
      title: "Service Desk Assistant",
      org: "Clemson Computing and Information Technology",
      dates: "September 1, 2024 – April 27, 2025",
      bullets: [
        "Troubleshot hardware, software, and network connectivity problems.",
        "Provided technical assistance in person and through VoIP support.",
        "Answered questions and resolved issues with patience and clear explanations.",
      ],
    },
  ],
  team: {
    title: "Clemson Cyber Defense Team",
    role: "Firewall Lead",
    dates: "Spring 2024 – Present",
    context: "Collegiate Cyber Defense Competition (CCDC) and scrimmages",
    bullets: [
      "Designed and deployed enterprise-like network environments with Ansible to simulate realistic infrastructure.",
      "Documented incidents and developed practice labs for intrusion detection, incident response, and system hardening.",
      "Configured and managed Palo Alto firewalls in lab and scrimmage environments.",
    ],
  },
  languages: ["Rust", "C", "C++", "Python", "Java", "JavaScript", "HTML"],
  tools: [
    "Splunk",
    "Microsoft Defender",
    "Abnormal AI",
    "Ansible",
    "Palo Alto",
  ],
};
