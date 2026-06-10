const fs = require('fs');
const file = 'c:/Users/Ahmed Bilal Khan/Desktop/salon/frontend/src/components/dashboard/StaffDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `setTreatmentData({ treatment_details: "", products_used: "", skin_reaction: "", improvement_notes: "" });`;
const replacement = `setTreatmentData({ treatment_details: "", products_used: "", skin_reaction: "", improvement_notes: "" });\r\n            fetchData();`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
} else {
    console.log("Target not found!");
}
