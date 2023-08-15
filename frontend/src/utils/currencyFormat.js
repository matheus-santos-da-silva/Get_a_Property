export default function formatCurrency(num) {
    const options = {
        style: 'currency',
        currency: 'BRL'
    }

    return num.toLocaleString('pt-BR', options)
}