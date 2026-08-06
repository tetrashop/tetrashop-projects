export default function handler(req, res) {
  const csvData = [
    ['ID', 'Type', 'Currency', 'Amount', 'Status', 'Time', 'TxHash'],
    ['1', 'deposit', 'USDT', '200', 'completed', new Date().toISOString(), '0xabc...'],
    ['2', 'withdraw', 'IRR', '500,000', 'pending', new Date().toISOString(), 'IRR-001'],
    ['3', 'deposit', 'BTC', '0.002', 'completed', new Date().toISOString(), '0x789...'],
  ].map(row => row.join(',')).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
  res.status(200).send(csvData);
}
