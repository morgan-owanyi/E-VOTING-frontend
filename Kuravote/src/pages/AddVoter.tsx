import React, { useRef } from "react";
type Props = {
  onAddSingle: (regNo: string) => void;
  onImportCSV: (regNos: string[]) => void;
};

export default function AddVoter({ onAddSingle, onImportCSV }: Props) {
  const [singleReg, setSingleReg] = React.useState("");
  const csvInput = useRef<HTMLInputElement>(null);

  function handleSingle(e: React.FormEvent) {
    e.preventDefault();
    if (singleReg.trim()) onAddSingle(singleReg.trim());
    setSingleReg("");
  }

  function handleCSVChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        const regNos = text.split("\n").map(r => r.trim()).filter(r => r);
        onImportCSV(regNos);
      };
      reader.readAsText(files[0]);
      if (csvInput.current) csvInput.current.value = "";
    }
  }

  return (
    <div>
      <form onSubmit={handleSingle} className="mb-2 d-flex gap-2">
        <input
          type="text"
          className="form-control"
          value={singleReg}
          onChange={e => setSingleReg(e.target.value)}
          placeholder="Add single voter by registration number"
        />
        <button className="btn btn-success">Add</button>
      </form>
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
    </div>
  );
}