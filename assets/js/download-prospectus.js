// Download prospectus functionality
function downloadProspectus() {
    // Create a blob with the prospectus content
    const prospectusContent = `
FRANCISCAN CATHOLIC NURSERY AND PRIMARY SCHOOL
School Prospectus 2025
"Quality Catholic Education Rooted in Franciscan Values"

📍 SCHOOL INFORMATION
Address: First Unity Estate, Off Cooperative Villa, Badore, Ajah, Lagos, Nigeria
Phone: +234 912 660 5391
Email: info@franciscancatholicschool.edu.ng | admissions@franciscancatholicschool.edu.ng
School Hours: Monday - Friday: 7:30 AM - 3:30 PM

🎓 OUR ACADEMIC PROGRAMMES
• Creche (Ages 1-2): Max 12 children - Basic care, sensory development
• Pre-School (Ages 3-4): Max 15 children - Play-based learning, pre-literacy
• Lower Primary (Ages 5-8): Max 20 children - Core subjects foundation
• Upper Primary (Ages 9-11): Max 20 children - Advanced curriculum

💰 FEE STRUCTURE (2025 Academic Year)
• Creche: Registration ₦50,000 | Tuition ₦180,000/term | Development ₦30,000
• Pre-School: Registration ₦60,000 | Tuition ₦200,000/term | Development ₦35,000  
• Lower Primary: Registration ₦80,000 | Tuition ₦250,000/term | Development ₦40,000
• Upper Primary: Registration ₦100,000 | Tuition ₦300,000/term | Development ₦50,000

💳 PAYMENT INFORMATION
Account Name: Franciscan Sisters Project Account
Account Number: 2006324090
Bank: First Bank

✨ OUR CORE VALUES
• Faith: Deepening relationship with God through prayer and Franciscan spirituality
• Stewardship: Cultivating excellence in academics and character
• Solidarity: Building a compassionate, collaborative community
• Integrity: Developing moral character through honesty and responsibility

📚 CORE SUBJECTS
English Language, Mathematics, Science, Social Studies, Religious Education,
French Language, Creative Arts, Physical Education

🏫 SCHOOL FACILITIES
Air-conditioned classrooms, ICT & Science labs, Library, Play areas,
Multi-purpose hall, School garden, CCTV security, First aid facilities

📋 ADMISSION REQUIREMENTS
• Completed application form
• Birth certificate (original and photocopy)
• Recent passport photographs (4 copies)  
• Immunization record
• Previous school report (for transfers)
• Medical report from recognized hospital
• Parent/Guardian identification

🎯 EXTRACURRICULAR ACTIVITIES
Arts & Culture: School choir, Drama club, Art and craft, Cultural dance
Sports: Football, Basketball, Athletics, Swimming
Academic Clubs: Debate society, Science club, Math olympiad
Service: Environmental club, Community service, Peer mentoring

📞 CONTACT FOR ADMISSION
Phone: +234 912 660 5391
Email: admissions@franciscancatholicschool.edu.ng
Visit: Unity Estate, Off Cooperative Villa, Badore, Ajah, Lagos

We look forward to welcoming your child to our school community!

© 2025 Franciscan Catholic Nursery and Primary School. All Rights Reserved.
`;

    // Create and download the file
    const blob = new Blob([prospectusContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'Franciscan-Catholic-School-Prospectus-2025.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Alternative function to download HTML version
function downloadHTMLProspectus() {
    const link = document.createElement('a');
    link.href = 'assets/docs/franciscan-prospectus-2025.html';
    link.download = 'Franciscan-School-Prospectus-2025.html';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
