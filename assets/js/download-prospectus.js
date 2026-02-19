// Download prospectus functionality
function downloadProspectus() {
    // Create a blob with the prospectus content
    const prospectusContent = `
FRANCISCAN CATHOLIC NURSERY AND PRIMARY SCHOOL
First Unity Estate, Last Bus-stop, Badore - Ajah, Lagos.
School Prospectus 2025/2026
"Per Virtutem Ad Astra"

📍 SCHOOL INFORMATION
Address: First Unity Estate, Off Cooperative Villa, Badore, Ajah, Lagos, Nigeria
Phone: 09136538240, 09077685251
Email: info@franciscancnps.org
School Hours: Monday - Friday: 7:30 AM - 3:30 PM

💰 FEE STRUCTURE (2025/2026 Academic Year)

EARLY YEARS 1, 2, 3 - SCHOOL BILL
S/N | DETAILS | NEW INTAKE/SECOND TERM | SUMMER/THIRD TERM
1 | Registration | ₦10,000 | -
2 | Acceptance Fee | ₦20,000 | -
3 | Tuition Fee | ₦150,000 | ₦150,000
4 | Educational Materials | ₦60,000 | -
5 | Other fees (Development levy, End of term & Medical, Club, Portal, Complete set of School Uniform) | ₦160,000 | ₦90,000
TOTAL | ₦400,000 | ₦240,000

CRECHE - SCHOOL BILL
S/N | DETAILS | NEW INTAKE/SECOND TERM | SUMMER/THIRD TERM
1 | Registration | ₦10,000 | -
2 | Acceptance Fee | ₦20,000 | -
3 | Tuition Fee | ₦150,000 | ₦150,000
4 | Development levy, End of term & Medical & Complete set of School | ₦140,000 | ₦50,000
TOTAL | ₦320,000 | ₦200,000

NOTE: All fees are to be paid in full before resumption. Cash payments is not welcomed. All payments should be made to the school bank account. Below is the school bank account details.

💳 PAYMENT INFORMATION
Account Number: 2006324090
Account Name: Franciscan Sisters Project
Bank: First Bank
Kindly come along with the teller/payment receipt to the school office to obtain the school's receipt for payment.

👔 SCHOOL UNIFORM TIME-TABLE
MONDAYS: Blue School Uniform, School Socks and Black shoes.
TUESDAYS: Blue School Uniform, School Socks and Black shoes.
WEDNESDAYS: Sports Wear, School Socks and White Sneakers.
THURSDAYS: Gray School Uniform, School Socks and Black shoes.
FRIDAYS: Gray School Uniform, School Socks and Black shoes.

💇 HAIR STYLE
GIRLS: Weaved or thread Hair style without beads or hair extensions.
BOYS: Low haircut.

🎨 LEARNERS CLUB
• Cookery
• Art
• Science
• Sports
• Music

NOTE (CRECHE): Learners are required to come with the following items:
• Extra Clothes
• Baby wipes
• Baby pampers

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
Phone: 09136538240, 09077685251
Email: info@franciscancnps.org
Visit: First Unity Estate, Off Cooperative Villa, Badore, Ajah, Lagos
Bookstore: Our Lady Mother and Queen Catholic Church Badore, Ajah

We look forward to welcoming your child to our school community!

© 2025 Franciscan Catholic Nursery and Primary School. All Rights Reserved.
`;

    // Create and download the file
    const blob = new Blob([prospectusContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'Franciscan-Catholic-School-Prospectus-2025-2026.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Download programme guide functionality
function downloadProgrammeGuide() {
    // Create a blob with the programme guide content
    const programmeGuideContent = `
FRANCISCAN CATHOLIC NURSERY AND PRIMARY SCHOOL
Programme Guide 2025
"Educational Excellence: Nurturing minds, hearts, and souls"

📚 EDUCATIONAL EXCELLENCE
At Franciscan Catholic School, we offer comprehensive educational programmes designed to nurture young minds and develop well-rounded individuals ready for the future. Our curriculum integrates modern teaching methods with traditional Catholic values, ensuring your child receives the best possible education.

Our programmes are structured to provide a seamless educational journey from early childhood through primary education. Each stage builds upon the previous one, creating a strong foundation for lifelong learning and character development.

Our dedicated teachers are committed to recognizing and developing each child's unique talents and abilities, fostering a love for learning that extends beyond the classroom.

🎓 EARLY YEARS PROGRAMME (Ages 1 – 4 years)
Our Early Years Programme is based on the UK's "Early Years Foundation Stage" curriculum, adapted to include Catholic values and teachings. It provides an integrated approach to care and education which is play-based, following the interests of the children.

The framework ensures a consistent approach to care, learning, and development, enabling our educators to plan learning that is appropriate for each child at every stage of their development through a range of engaging activities.

The aim of our Early Years Programme is to help children achieve the five outcomes of the "EVERY CHILD MATTERS" principle while nurturing their spiritual growth and character development in a Catholic environment.

Programme Features:
• Creative Expression
• Physical Development
• Early Literacy
• Numeracy Skills
• Faith Formation
• Social Development

Levels:
• Creche: Playgroup 1 & 2 (Ages 1-2 years)
• PreSchool: Nursery 1 & 2 (Ages 3-4 years)

🏫 PRIMARY PROGRAMME (Ages 5– 11 years)
Our Primary Programme delivers a curriculum in an integrated manner through cross-curricular themes. It aims to promote healthy spiritual, moral, cultural, cognitive, and physical development in every child.

We run an integrated and unique curriculum with a clear process of learning and specific learning goals for every subject, with national relevance, global mindedness, and personal learning objectives. Catholic teachings and values are woven throughout the curriculum.

We have developed learning-focused activities across different subjects that help children develop awareness of themselves, their community, and the world around them, as well as inspiring positive action and engagement with global issues from a Catholic perspective.

Programme Features:
• Language Arts
• Mathematics
• Science
• Social Studies
• Religious Education
• Creative Arts

Levels:
• Key Stage One: Primary 1 & 2 (Ages 5-7 years)
• Key Stage Two: Primary 3 to 6 (Ages 8-11 years)

🌍 OUR BLENDED CURRICULUM
At Franciscan Catholic School, we believe that no single curriculum is perfect; each has its strengths and areas for improvement. That's why we provide a unique, comprehensive, integrated, and balanced curriculum that caters to all our children's diverse needs and learning styles.

We run a blended curriculum that ensures the best of the British and Montessori curricula is integrated with the Nigerian curriculum, all within the framework of Catholic education. This approach provides children with a world-class education that is relevant and prepares them for life in a globalized world as Africans and Catholics.

To complement our academic curriculum, we offer a variety of extra-curricular activities such as swimming, ballet, taekwondo, chess, and music. These activities help develop well-rounded individuals with diverse talents and interests.

Curriculum Approaches:
• British Curriculum: Structured approach with clear progression and assessment frameworks that develop critical thinking and problem-solving skills.
• Montessori Method: Child-centered approach that fosters independence, self-directed learning, and respect for each child's natural development.
• Catholic Education: Faith-based framework that integrates spiritual formation and moral values throughout all aspects of learning.

📞 CONTACT INFORMATION
Address: First Unity Estate, Off Cooperative Villa, Badore, Ajah, Lagos, Nigeria
Phone: +234 912 660 5391
Email: info@franciscancatholicschool.edu.ng
School Hours: Monday - Friday: 7:30 AM - 3:30 PM

We look forward to welcoming your child to our school community!

© 2025 Franciscan Catholic Nursery and Primary School. All Rights Reserved.
`;

    // Create and download the file
    const blob = new Blob([programmeGuideContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'Franciscan-Programme-Guide-2025.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
