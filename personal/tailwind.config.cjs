module.exports = {
  content: ['./caffoot-personal.html'],
  darkMode: 'class',
  theme: { extend: { colors: { brand: { 50:'#eef2ff',100:'#e0e7ff',500:'#6366f1',600:'#4f46e5',700:'#4338ca' } } } },
  safelist: [
    { pattern: /^(bg|text|border)-(red|green|yellow|blue|gray|slate|indigo|amber|emerald)-(50|100|200|300|400|500|600|700|800|900)$/, variants:['dark','hover'] },
    { pattern: /^(hidden|block|flex|grid|inline-flex)$/, variants:['sm','md','lg'] }
  ]
};
