import React, { useRef } from "react";
type Props = {
  onAddSingle: (regNo: string, email: string) => void;
  onImportCSV: (voters: Array<{registration_number: string, email: string}>) => void;
};

export default function AddVoter({ onAddSingle, onImportCSV }: Props) {
  const [singleReg, setSingleReg] = React.useState("");
  const [singleEmail, setSingleEmail] = React.useState("");
  const csvInput = useRef<HTMLInputElement>(null);

  function handleSingle(e: React.FormEvent) {
    e.preventDefault();
    if (singleReg.trim() && singleEmail.trim()) {
      onAddSingle(singleReg.trim(), singleEmail.trim());
      setSingleReg("");
      setSingleEmail("");
    } else {
      alert("Please provide both registration number and email");
    }
  }

  function handleCSVChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        const lines = text.split("\n").map(r => r.trim()).filter(r => r);
        
        // Parse CSV with headers (registration_number,email)
        const voters = [];
        for (let i = 1; i < lines.length; i++) { // Skip header row
          const [regNo, email] = lines[i].split(",").map(s => s.trim());
          if (regNo && email) {
            voters.push({ registration_number: regNo, email: email });
          }
        }
        
        if (voters.length === 0) {
          alert("No valid voter data found. Please ensure CSV has 'registration_number,email' format");
          return;
        }
        
        onImportCSV(voters);
      };
      reader.readAsText(files[0]);
      if (csvInput.current) csvInput.current.value = "";
    }
  }

  return (
    <div>
      <form onSubmit={handleSingle} className="mb-2">
        <div className="d-flex gap-2 mb-2">
          <input
            type="text"
            className="form-control"
            value={singleReg}
            onChange={e => setSingleReg(e.target.value)}
            placeholder="Registration number"
            required
          />
          <input
            type="email"
            className="form-control"
            value={singleEmail}
            onChange={e => setSingleEmail(e.target.value)}
            placeholder="Email address"
            required
          />
        </div>
        <button className="btn btn-success">Add Single Voter</button>
      </form>
      <div>
        <label className="btn btn-primary">
          Import CSV
          <input
            ref={csvInput}
            type="file"
            accept=".csv"
            hidden
            onChange={handleCSVChange}
          />
        </label>
        <a href="/voter_template.csv" download className="btn btn-link">Download Template</a>
      </div>
    </div>
  );
}