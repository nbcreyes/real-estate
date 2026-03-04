import { useState } from "react"
import Input from "../components/Input"
import Button from "../components/Button"

export default function Mortgage() {
  const [form, setForm] = useState({
    price: "",
    downPayment: "",
    interestRate: "",
    term: "30",
  })
  const [result, setResult] = useState(null)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const calculate = (e) => {
    e.preventDefault()
    const price = parseFloat(form.price)
    const downPayment = parseFloat(form.downPayment)
    const annualRate = parseFloat(form.interestRate)
    const termYears = parseInt(form.term)

    const principal = price - downPayment
    const monthlyRate = annualRate / 100 / 12
    const numPayments = termYears * 12

    const monthly = monthlyRate === 0
      ? principal / numPayments
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)

    const totalPayment = monthly * numPayments
    const totalInterest = totalPayment - principal

    setResult({
      monthly: monthly.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      principal: principal.toFixed(2),
    })
  }

  const reset = () => {
    setForm({ price: "", downPayment: "", interestRate: "", term: "30" })
    setResult(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mortgage Calculator</h1>
      <p className="text-gray-500 mb-8">Estimate your monthly mortgage payment based on your loan details.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={calculate} className="flex flex-col gap-4">
            <Input
              label="Home Price ($)"
              type="number"
              name="price"
              placeholder="e.g. 500000"
              value={form.price}
              onChange={handleChange}
              required
            />
            <Input
              label="Down Payment ($)"
              type="number"
              name="downPayment"
              placeholder="e.g. 100000"
              value={form.downPayment}
              onChange={handleChange}
              required
            />
            <Input
              label="Annual Interest Rate (%)"
              type="number"
              name="interestRate"
              placeholder="e.g. 6.5"
              step="0.01"
              value={form.interestRate}
              onChange={handleChange}
              required
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Loan Term</label>
              <select
                name="term"
                value={form.term}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="10">10 years</option>
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="30">30 years</option>
              </select>
            </div>
            <div className="flex gap-3 mt-2">
              <Button type="submit" size="lg" className="flex-1">Calculate</Button>
              <Button type="button" variant="secondary" size="lg" onClick={reset}>Reset</Button>
            </div>
          </form>
        </div>

        <div>
          {result ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Estimate</h2>
              <div className="bg-primary-50 rounded-xl p-5 text-center">
                <p className="text-sm text-primary-600 font-medium">Monthly Payment</p>
                <p className="text-4xl font-bold text-primary-600 mt-1">${parseFloat(result.monthly).toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Loan Amount</span>
                  <span className="font-semibold text-gray-900">${parseFloat(result.principal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Total Interest</span>
                  <span className="font-semibold text-gray-900">${parseFloat(result.totalInterest).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-500 text-sm">Total Payment</span>
                  <span className="font-semibold text-gray-900">${parseFloat(result.totalPayment).toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">This is an estimate only. Actual payments may vary based on taxes, insurance, and lender terms.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center h-full text-center gap-3">
              <p className="text-gray-400">Fill in the form to calculate your estimated monthly payment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}