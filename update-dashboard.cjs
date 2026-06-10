const fs = require('fs');
const file = 'c:/Users/Ahmed Bilal Khan/Desktop/salon/frontend/src/components/dashboard/StaffDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `{b.status === 'completed' && (
                                                <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[10px] uppercase tracking-widest h-10 px-6 rounded-xl flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4" /> Accomplished
                                                </Badge>
                                            )}`;

const replacement = `{b.status === 'completed' && (
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[10px] uppercase tracking-widest h-10 px-6 rounded-xl flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4" /> Accomplished
                                                    </Badge>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            const record = b.treatment_records?.[0];
                                                            if (record) {
                                                                setTreatmentData({
                                                                    treatment_details: record.treatment_details || "",
                                                                    products_used: record.products_used || "",
                                                                    skin_reaction: record.skin_reaction || "",
                                                                    improvement_notes: record.improvement_notes || ""
                                                                });
                                                            } else {
                                                                setTreatmentData({ treatment_details: "", products_used: "", skin_reaction: "", improvement_notes: "" });
                                                            }
                                                            setRecordBookingId(b.id);
                                                        }}
                                                        className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#55402f] border-[#55402f]/20 hover:bg-[#55402f]/5 transition-all active:scale-95"
                                                    >
                                                        View Log
                                                    </Button>
                                                </div>
                                            )}`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log("Replaced using standard string match");
} else if (content.includes(target.replace(/\n/g, '\r\n'))) {
    content = content.replace(target.replace(/\n/g, '\r\n'), replacement.replace(/\n/g, '\r\n'));
    fs.writeFileSync(file, content);
    console.log("Replaced using CRLF string match");
} else {
    console.log("Target not found!");
}
