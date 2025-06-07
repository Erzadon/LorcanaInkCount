# Lorcana Ink Calculator

This project is a simple React application for planning Lorcana deck ink curves. It allows you to input card costs and see how many inkables you should include for a desired success rate.

The "Override Inkables" field lets you specify the exact number of inkable cards in your deck. If left blank, the calculator assumes any cards not accounted for in the cost breakdown are inkables. The recommended maximum number of non‑inkables is computed based on the target success rate, while the displayed success rate reflects your actual inkable count.

## Development

Install dependencies and start a local dev server:

```bash
npm install
npm start
```

## License

This project is licensed under the [MIT License](LICENSE).
