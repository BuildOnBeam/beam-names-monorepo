import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { isNumber } from '@onbeam/utils';
import { isAddress } from 'viem';

type ParsedData = {
  recipient: string;
  amount: number;
};

const recipientKeys = [
  'address',
  'to',
  'recipient',
  'wallet',
  'account',
  'wallet address',
];

const amountKeys = [
  'amount',
  'quantity',
  'value',
  'tokens',
  'balance',
  'token amount',
];

export const parseExcel = (data: string) => {
  const workbook = XLSX.read(data, { type: 'binary' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(firstSheet) as Record<string, any>[];

  if (!rows.length) return [];

  const headerKeys = Object.keys(rows[0]);

  const recipientKey = headerKeys.find((key) =>
    recipientKeys.includes(key.toLowerCase()),
  );

  const amountKey = headerKeys.find((key) =>
    amountKeys.includes(key.toLowerCase()),
  );

  if (!recipientKey || !amountKey) return [];

  return rows
    .map((row) => ({
      recipient: String(row[recipientKey]).trim(),
      amount: Number.parseFloat(row[amountKey]),
    }))
    .filter(
      ({ recipient, amount }) => isAddress(recipient) && isNumber(amount),
    );
};

export const parseCsv = (data: string) => {
  const rows = Papa.parse<string[]>(data, {
    skipEmptyLines: true,
  }).data;

  if (!rows.length) return [];

  const firstRow = rows[0];
  const hasHeaders = !firstRow.some((item) => isAddress(item.trim()));

  if (!hasHeaders) {
    return rows
      .map(([recipient, amount]) => ({
        recipient: recipient.trim(),
        amount: Number.parseFloat(amount),
      }))
      .filter(
        ({ recipient, amount }) => isAddress(recipient) && isNumber(amount),
      );
  }

  const headerRow = firstRow.map((h) => h.toLowerCase());
  const bodyRows = rows.slice(1);

  const recipientIndex = headerRow.findIndex((header) =>
    recipientKeys.includes(header),
  );

  const amountIndex = headerRow.findIndex((header) =>
    amountKeys.includes(header),
  );

  return bodyRows
    .map((row) => ({
      recipient: row[recipientIndex],
      amount: Number.parseFloat(row[amountIndex]),
    }))
    .filter(
      ({ recipient, amount }) => isAddress(recipient) && isNumber(amount),
    );
};

export const parseFile = async (file: File): Promise<ParsedData[]> => {
  const fileExt = file?.name?.split('.')?.pop()?.toLowerCase();

  if (!fileExt)
    throw new Error(
      'This file type is not supported, please use CSV, XLSX, or TXT.',
    );

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result as string;

      if (!data) {
        reject(
          new Error(
            'Something went wrong while reading the file. Please try again.',
          ),
        );
        return;
      }

      try {
        if (['csv', 'txt'].includes(fileExt)) {
          resolve(parseCsv(data));
        } else if (['xlsx', 'xls'].includes(fileExt)) {
          resolve(parseExcel(data));
        } else {
          reject(
            new Error(
              'This file type is not supported, please use CSV, XLSX, or TXT.',
            ),
          );
        }
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(
        new Error(
          'An error occurred while reading the file. Please try again.',
        ),
      );
    };

    if (['xlsx', 'xls'].includes(fileExt)) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
};

export const toTextareaString = (data: ParsedData[]) =>
  data.map(({ recipient, amount }) => `${recipient}, ${amount}`).join('\n');

export const fromTextareaString = (data: string) =>
  data
    .split('\n')
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row, index) => {
      const rowNumber = index + 1;

      // Replace any space, comma, or = with a comma
      const normalized = row.replace(/[=,\s]+/, ',');
      const [recipient, amount] = normalized.split(',');
      const trimmedRecipient = recipient?.trim();
      const parsedAmount = Number.parseFloat(amount?.trim());

      if (!isAddress(trimmedRecipient)) {
        throw new Error(
          `Invalid address on row ${rowNumber}: ${trimmedRecipient}`,
        );
      }

      if (!isNumber(parsedAmount)) {
        throw new Error(`Invalid amount on row ${rowNumber}`);
      }

      return {
        recipient: trimmedRecipient,
        amount: parsedAmount,
      };
    });
