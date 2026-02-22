
import './App.css';

export default function App() {
  return (
    <>
      {/* Injeta estilos globais (fontes + reset) */}
      <Global styles={globalStyles} />

      <Vitrine>
        {produtos.map((p) => (
          <CardProduto key={p.id} {...p} />
        ))}
      </Vitrine>
    </>
  );
}


