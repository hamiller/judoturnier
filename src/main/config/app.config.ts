import dotenv from 'dotenv';
dotenv.config();

function convertToBoolean(input: string | undefined): boolean | undefined {
  if (!input) return undefined;
  
  try {
      return JSON.parse(input.toLowerCase());
  }
  catch (e) {
      return undefined;
  }
}

export const randoriTurnier = convertToBoolean(process.env.RANDORI_TURNIER);