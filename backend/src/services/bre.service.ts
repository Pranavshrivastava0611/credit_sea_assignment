interface BREInput {
  dateOfBirth: string | Date;
  monthlySalary: number;
  pan: string;
  employmentMode: string;
}

interface BREResult {
  passed: boolean;
  failedRules: string[];
}

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

function getAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export function runBRE(input: BREInput): BREResult {
  const failedRules: string[] = [];
  const dob = new Date(input.dateOfBirth);
  const age = getAge(dob);

  if (isNaN(dob.getTime())) {
    failedRules.push("Invalid date of birth provided.");
  } else {
    if (age < 23 || age > 50) {
      failedRules.push(`Age must be between 23 and 50. Your age: ${age}`);
    }
  }

  if (input.monthlySalary < 25000) {
    failedRules.push(
      `Monthly salary must be at least ₹25,000. Provided: ₹${input.monthlySalary.toLocaleString("en-IN")}`
    );
  }

  if (!PAN_REGEX.test(input.pan.toUpperCase())) {
    failedRules.push(
      "Invalid PAN format. PAN must match AAAAA9999A (5 letters, 4 digits, 1 letter)."
    );
  }

  if (input.employmentMode === "Unemployed") {
    failedRules.push("Unemployed applicants are not eligible for a loan.");
  }

  return { passed: failedRules.length === 0, failedRules };
}
