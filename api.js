import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "frontend")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/music", express.static(path.join(__dirname, "frontend/music")));

// Constante com as fases da lua
const FASES = [
  { 
    nome: "Lua Nova", 
    img: "lua-nova.png",
    descricao: "A Lua Nova marca o início de um novo ciclo lunar. Nesta fase, a Lua está entre a Terra e o Sol, tornando-a invisível do nosso ponto de vista. É um momento de renovação e novos começos. Curiosidade: Muitas culturas associam a Lua Nova a plantios e intenções positivas."
  },
  { 
    nome: "Lua Crescente", 
    img: "lua-crescente.png",
    descricao: "A Lua Crescente aparece como uma fina fatia iluminada. Representa crescimento e manifestação de ideias. É uma fase de planejamento e ação inicial. Curiosidade: Nesta fase, a Lua 'cresce' visivelmente a cada noite, simbolizando progresso."
  },
  { 
    nome: "Quarto Crescente", 
    img: "quarto-crescente.png",
    descricao: "No Quarto Crescente, metade da Lua está iluminada. É uma fase de equilíbrio entre ação e reflexão. Ideal para tomar decisões e ajustar planos. Curiosidade: Também conhecida como 'Lua do Primeiro Quarto', marca o ponto médio entre Nova e Cheia."
  },
  { 
    nome: "Lua Gibosa Crescente", 
    img: "lua-gibosa-crescente.png",
    descricao: "A Lua Gibosa Crescente mostra mais de metade iluminada, com uma forma arredondada. Representa abundância e realização. É tempo de colher frutos do trabalho. Curiosidade: 'Gibosa' vem do latim e significa 'corcunda', referindo-se à forma curvada."
  },
  { 
    nome: "Lua Cheia", 
    img: "lua-cheia.png",
    descricao: "A Lua Cheia é o ápice do ciclo, com a Lua totalmente iluminada. Simboliza plenitude, energia máxima e revelações. É uma fase poderosa para manifestações. Curiosidade: As marés são mais fortes durante a Lua Cheia devido à atração gravitacional."
  },
  { 
    nome: "Lua Gibosa Minguante",
    img: "lua-gibosa-minguante.png",
    descricao: "A Lua Gibosa Minguante começa a 'diminuir', com menos de metade iluminada. Representa gratidão e compartilhamento. É momento de refletir sobre conquistas. Curiosidade: Nesta fase, a Lua parece 'encolher' gradualmente."
  },
  { 
    nome: "Quarto Minguante", 
    img: "quarto-minguante.png",
    descricao: "No Quarto Minguante, novamente metade está iluminada, mas do lado oposto. É uma fase de liberação e limpeza. Ideal para deixar ir o que não serve mais. Curiosidade: Também chamada de 'Último Quarto', precede a Lua Nova."
  },
  { 
    nome: "Lua Minguante", 
    img: "lua-minguante.png",
    descricao: "A Lua Minguante é a fase final do ciclo, com apenas uma fina fatia visível. Representa descanso, introspecção e preparação para o novo. Curiosidade: É um bom momento para atividades que requerem foco interno, como meditação."
  }
];

// Calcula a fase e iluminação da lua
function calcularFaseLua(data = new Date()) {
  const CICLO_LUNAR = 2551443;
  const LUA_NOVA_REF = new Date("2001-01-24T13:44:00Z");
  
  const tempoDecorrido = (data.getTime() - LUA_NOVA_REF.getTime()) / 1000;
  const fase = tempoDecorrido % CICLO_LUNAR;
  const iluminacao = Math.round((1 - Math.cos((2 * Math.PI * fase) / CICLO_LUNAR)) * 50);
  const indice = Math.floor((fase / CICLO_LUNAR) * 8) % 8;

  return {
    fase: FASES[indice].nome,
    imagem: FASES[indice].img,
    iluminacao,
    descricao: FASES[indice].descricao
  };
}

// Formata a resposta JSON
function formatarResposta(data, lua) {
  return {
    data: data.toISOString().split("T")[0],
    ...lua
  };
}

// Rota para hoje (sem data)
app.get("/lua", (req, res) => {
  try {
    const data = new Date();
    const lua = calcularFaseLua(data);
    res.json(formatarResposta(data, lua));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao calcular a fase lunar" });
  }
});

// Rota para uma data específica
app.get("/lua/:data", (req, res) => {
  try {
    const { data: dataStr } = req.params;
    const data = new Date(dataStr);
    
    if (isNaN(data.getTime())) {
      return res.status(400).json({ error: "Data inválida. Use o formato YYYY-MM-DD" });
    }
    
    const lua = calcularFaseLua(data);
    res.json(formatarResposta(data, lua));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao calcular a fase lunar" });
  }
});

app.listen(PORT, () => {
  console.log(`rodando em http://localhost:${PORT}`);
});
