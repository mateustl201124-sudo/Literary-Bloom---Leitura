import { Book } from '../types/library';

// Curated classic books with identical 6-page editorial volume size modeled on Dom Casmurro
export const INITIAL_BOOKS: Book[] = [
  {
    id: 'dom-casmurro',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    genre: 'Clássicos Brasileiros',
    description: 'A célebre narrativa de Bento Santiago (o Casmurro), relembrando sua paixão por Capitu, os olhos de ressaca e a dúvida que assombra a literatura brasileira.',
    coverUrl: '/src/assets/images/cover_dom_casmurro_1790291703864.jpg',
    totalPages: 6,
    currentPage: 2,
    format: 'txt',
    status: 'reading',
    rating: 5,
    favorite: true,
    shelf: 'Obras-Primas',
    dateAdded: '2026-09-01T10:00:00.000Z',
    lastReadDate: '2026-09-23T21:40:00.000Z',
    readingSessions: [
      { date: '2026-09-20', pagesRead: 1, durationMinutes: 25 },
      { date: '2026-09-22', pagesRead: 1, durationMinutes: 30 },
      { date: '2026-09-23', pagesRead: 1, durationMinutes: 25 },
    ],
    bookmarks: [
      {
        id: 'bm-1',
        page: 4,
        chapterTitle: 'Capítulo IV: A inscrição',
        label: 'A promessa no muro de Matacavalos',
        createdAt: '2026-09-22T19:15:00.000Z',
      },
      {
        id: 'bm-2',
        page: 5,
        chapterTitle: 'Capítulo V: Olhos de ressaca',
        label: 'A famosa descrição do olhar de Capitu',
        createdAt: '2026-09-23T21:38:00.000Z',
      },
    ],
    notes: [
      {
        id: 'n-1',
        page: 4,
        quote: 'Capitu era Capitu, isto é, uma criatura muito particular, mais mulher do que eu era homem.',
        note: 'Machado destaca desde a adolescência a maturidade e sagacidade psicológica de Capitu frente à ingenuidade de Bentinho.',
        createdAt: '2026-09-22T19:20:00.000Z',
        color: 'amber',
      },
      {
        id: 'n-2',
        page: 5,
        quote: 'Traziam não sei que fluido misterioso e enérgico, uma força que arrastava para dentro, como a vaga que se retira da praia nos dias de ressaca.',
        note: 'A metáfora dos olhos de ressaca: atração irresistível e perigo iminente.',
        createdAt: '2026-09-23T21:42:00.000Z',
        color: 'emerald',
      },
    ],
    chapters: [
      {
        id: 'cap-1',
        title: 'I - Do título',
        content: `Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu. Cumprimentou-me, sentou-se ao pé de mim, falou da lua e dos ministros, e acabou recitando-me versos. A viagem era curta, e os versos pode ser que não fossem inteiramente maus; porém o meu cansaço era grande, e fechei os olhos três ou quatro vezes; tanto bastou para que ele calasse e saísse ao apeadeiro.

No dia seguinte entrou a dizer de mim nomes feios, e acabou alcunhando-me Dom Casmurro. Os vizinhos, que não gostam dos meus hábitos reclusos e calados, deram curso à alcunha, que afinal pegou. Nem por isso me zanguei. Contei a anedota aos amigos da cidade, e eles, por graça, chamam-me assim, alguns em cartas: "Meu caro Dom Casmurro, etc."

Não consulteis os dicionários. Casmurro não está aqui no sentido que eles lhe dão, mas no que lhe pôs o vulgo de homem calado e metido consigo. Dom veio por ironia, para atribuir-me fumos de fidalgo. Tudo por estar cochilando! Também não achei melhor título para a minha narração; se não tiver outro daqui até ao fim do livro, vai este mesmo. O meu fim evidente era atar as duas pontas da vida, e restaurar na velhice a adolescência. Pois, senhor, não consegui recompor o que foi nem o que fui.`
      },
      {
        id: 'cap-2',
        title: 'II - Do livro',
        content: `Agora que expliquei o título, passo a escrever o livro. Antes disso, todavia, uma palavra sobre a casa em que moro. Foi construída no Engenho Novo, à imitação daquela em que fui criado, na antiga rua de Matacavalos. Quis reproduzir nela o mesmo aspecto, a mesma distribuição de cômodos, até as mesmas pinturas murais, nas quais figuram passarinhos, flores e quatro figuras alegóricas: a Poesia, a Pintura, a Música e a Filosofia.

Compreende-se que o meu propósito era reatar o passado ao presente. Mas a casa não é a mesma; faltam-lhe as pessoas, falta-lhe a juventude, e o próprio ar parece outro.

Eis aqui a razão por que me decidi a pegar na pena. Vivo só, com um criado. A casa é grande e silenciosa. Para preencher os dias vazios, resolvi pôr no papel as recordações que me povoam a memória. Será este livro um desabafo ou uma justificação? O leitor dirá, se tiver paciência de me acompanhar até a última linha.`
      },
      {
        id: 'cap-3',
        title: 'III - A denúncia',
        content: `Ia a entrar na sala de visitas, quando ouvi proferir o meu nome e escondi-me atrás da porta. A casa era a da rua de Matacavalos, o mês novembro, o ano é que é um tanto remoto, mas eu não hei de trocar as datas da minha vida só para agradar aos que não amam velhices; o ano era 1857.

— D. Glória, a senhora persiste na ideia de meter o Bentinho no seminário? É mais que tempo, e já agora pode haver uma dificuldade.
— Que dificuldade?
— Uma grande dificuldade.

Minha mãe quis saber o que era. José Dias, depois de espiar se alguém nos ouvia no corredor, deu um passo para a frente e respondeu a meia-voz:
— Tenho notado que eles andam muito de segredinhos, sempre juntos. O Bentinho quase não sai de lá, e a Capitu vem cá a miúdo. Não digo que haja nada de mal, são crianças; mas o rapaz está crescendo, e a pequena não é nenhuma boba...

Minha mãe empalideceu. José Dias era o nosso agregado, homem cerimonioso e enfático, que falava com superlativos.`
      },
      {
        id: 'cap-4',
        title: 'XIV - A inscrição',
        content: `No dia seguinte, fui ter com Capitu logo cedo. Encontrei-a no quintal, junto ao muro que dividia as nossas casas. Tinha na mão um pedaço de ferro e riscava o reboco.

— Que estás fazendo aí, Capitu?
Ela assustou-se e tentou esconder a mão com o ferro.
— Nada, Bentinho, nada...
Aproximei-me e li gravado na cal fresca da parede: "BENTO E CAPITOLINA".

Olhei para ela; ela baixou os olhos, vermelha como uma pitanga. O coração começou a bater-me com uma violência desusada. Naquele instante compreendi tudo: não éramos mais duas crianças que brincavam de casinha; éramos homem e mulher, unidos por um segredo e por uma promessa muda.

Tomei-lhe as mãos. Estavam frias e tremiam ligeiramente. Quis falar, mas a voz prendeu-se-me na garganta. Ela ergueu os olhos — aqueles olhos que mais tarde me trariam tanta perdição — e sorriu com uma ternura infinita.`
      },
      {
        id: 'cap-5',
        title: 'XXXII - Olhos de ressaca',
        content: `Capitu era Capitu, isto é, uma criatura muito particular, mais mulher do que eu era homem. Se ainda o não disse, aí fica. Se disse, fica também. Há conceitos que se devem incutir na alma do leitor, à força de repetição.

Deixei-me ficar a olhar para ela. Capitu olhava para o chão. Quando levantou os olhos, vi neles uma expressão nova, indefinível, que nunca mais esqueci.

Retórica dos namorados, dá-me uma comparação exata e poética para dizer o que foram aqueles olhos de Capitu. Não me acode imagem capaz de exprimir, sem quebra da dignidade do estilo, a sensação que recebi. Olhos de ressaca? Vá, de ressaca. É o que me dá ideia daquela feição. Traziam não sei que fluido misterioso e enérgico, uma força que arrastava para dentro, como a vaga que se retira da praia nos dias de ressaca.

Para não ser arrastado, agarrei-me às outras partes vizinhas, às orelhas, aos braços, aos cabelos espalhados pelos ombros; mas tão depressa buscava as pupilas, a onda que saía delas vinha crescendo, cava e escura, ameaçando engolir-me, puxar-me para o abismo...`
      },
      {
        id: 'cap-6',
        title: 'CXXXV - Otelo',
        content: `Jantei fora. À noite fui ao teatro. Representava-se justamente Otelo, de Shakespeare, que eu não vira nem lera nunca; sabia apenas o assunto, e achava-o bárbaro.

Fui ver como o mouro matava a esposa inocente por ciúmes infundados. A tragédia abalou-me até o fundo das entranhas. Conforme a peça avançava, e Iago tecia a sua rede de intrigas e meias-verdades, sentia o peito oprimir-se.

Mas quando Otelo, cego de fúria e dor, esgana Desdêmona no leito nupcial, um calafrio percorreu-me o corpo todo. E pensei comigo mesmo: Otelo matou por suspeitas falsas; mas e se fossem verdadeiras? E se o lenço estivesse mesmo nas mãos do outro? A minha Desdêmona não era uma veneziana pura e ingênua; era a filha de Pádua, a menina dos olhos oblíquos e dissimulados que desde os catorze anos sabia fingir e calar...`
      }
    ]
  },
  {
    id: 'a-metamorfose',
    title: 'A Metamorfose',
    author: 'Franz Kafka',
    genre: 'Ficção & Existencialismo',
    description: 'Quando Gregor Samsa acorda transformado num inseto monstruoso, tem início uma das reflexões mais pungentes e perturbadoras sobre alienação, dever e família na modernidade.',
    coverUrl: '/src/assets/images/cover_metamorfose_1790291714560.jpg',
    totalPages: 6,
    currentPage: 6,
    format: 'txt',
    status: 'completed',
    rating: 5,
    favorite: true,
    shelf: 'Favoritos da Vida',
    dateAdded: '2026-08-15T14:30:00.000Z',
    lastReadDate: '2026-09-10T18:00:00.000Z',
    readingSessions: [
      { date: '2026-09-08', pagesRead: 2, durationMinutes: 45 },
      { date: '2026-09-09', pagesRead: 2, durationMinutes: 50 },
      { date: '2026-09-10', pagesRead: 2, durationMinutes: 35 },
    ],
    bookmarks: [
      {
        id: 'bm-meta-1',
        page: 1,
        chapterTitle: 'Capítulo I: O despertar',
        label: 'A abertura imortal de Kafka',
        createdAt: '2026-09-08T15:00:00.000Z',
      },
    ],
    notes: [
      {
        id: 'n-meta-1',
        page: 1,
        quote: 'Quando certa manhã Gregor Samsa acordou de sonhos intranquilos, encontrou-se em sua cama metamorfoseado num inseto monstruoso.',
        note: 'A genialidade de não explicar a causa, tratando o absurdo com naturalidade burocrática cotidiana.',
        createdAt: '2026-09-08T15:10:00.000Z',
        color: 'violet',
      },
    ],
    chapters: [
      {
        id: 'meta-1',
        title: 'I - O despertar e a couraça',
        content: `Quando certa manhã Gregor Samsa acordou de sonhos intranquilos, encontrou-se em sua cama metamorfoseado num inseto monstruoso. Estava deitado sobre o dorso duro como couraça e, ao levantar um pouco a cabeça, viu seu ventre abaulado, castanho, dividido por nervuras arqueadas, sobre cujo topo a coberta da cama, prestes a deslizar de vez, ainda mal se sustentava. Suas numerosas pernas, lastimavelmente finas em comparação com a grossura habitual, cintilavam desamparadas diante dos seus olhos.

"O que aconteceu comigo?", pensou. Não era um sonho. Seu quarto, um quarto de tamanho normal, apenas um pouco acanhado, continuava calmo entre as quatro paredes bem conhecidas. Sobre a mesa, na qual se espalhava um mostruário desempacotado de tecidos de lã — Samsa era caixeiro-viajante —, via-se pendurada uma gravura recortada havia pouco de uma revista ilustrada e posta numa moldura dourada.

O olhar de Gregor dirigiu-se em seguida para a janela, e o tempo nublado — ouviam-se gotas de chuva batendo no zinco do parapeito — deixou-o inteiramente melancólico. "Como seria se eu dormisse mais um pouco e esquecesse todas essas loucuras?", pensou; mas isso era inexequível, pois estava acostumado a dormir sobre o lado direito.`
      },
      {
        id: 'meta-2',
        title: 'II - O mostruário e a porta fechada',
        content: `E olhou para o despertador que tiquetaqueava sobre o baú. "Deus do céu!", pensou. Eram seis horas e meia e os ponteiros avançavam tranquilamente; na verdade já passava do meio, aproximavam-se rapidamente das sete horas menos um quarto. Deveria o despertador não ter tocado?

Viam-se claramente os ponteiros marcando quatro horas; com certeza tinha tocado. Mas seria possível continuar dormindo pacificamente com aquele som que fazia tremer os móveis? Bem, seu sono não tinha sido calmo, porém fora provavelmente profundo.

No entanto, o que devia fazer agora? O próximo trem partia às sete horas; para apanhá-lo precisaria se apressar como um louco, e o mostruário ainda nem sequer estava empacotado. Além disso, não se sentia com especial disposição para saltar da cama. E mesmo que apanhasse o trem, a repreensão do chefe era inevitável, pois o contínuo da firma esperara pelo trem das cinco e já devia ter comunicado a sua ausência havia muito.`
      },
      {
        id: 'meta-3',
        title: 'III - O alimento e o leite recusado',
        content: `Gregor só despertou do seu sono pesado, semelhante a um desmaio, no crepúsculo. Não teria demorado com certeza muito a acordar, mesmo sem ser incomodado, pois sentia-se suficientemente descansado e repousado; mas pareceu-lhe que passos fugitivos e o fechar cauteloso da porta que dava para o vestíbulo haviam-no despertado.

A claridade da iluminação elétrica pública deitava aqui e ali reflexos pálidos no teto e nas partes superiores dos móveis, mas lá embaixo, onde Gregor estava, tudo permanecia escuro. Tateando devagar, ainda tonto e estranhando as novas ferramentas com que se movia, empurrou-se em direção à porta para ver o que havia acontecido.

Junto à porta descobriu o que realmente o atraíra: o cheiro de alguma coisa comestível. Ali havia uma tigela com leite fresco, no qual boiavam pedacinhos de pão branco. Quase chorou de alegria, pois sua fome agora era maior ainda do que pela manhã; mergulhou imediatamente a cabeça até quase cobrir os olhos no leite. Mas logo a retirou com desapontamento: o leite, outrora sua bebida predileta, não lhe agradava em absoluto; aliás, sentia uma repulsa involuntária.`
      },
      {
        id: 'meta-4',
        title: 'IV - A maçã e o ferimento',
        content: `A maçã seguinte, que foi atirada logo atrás, cravou-se literalmente nas costas de Gregor; Gregor quis arrastar-se mais para a frente, como se aquela dor inacreditável e terrível pudesse passar com uma mudança de lugar; mas sentiu-se como que pregado ao chão e esticou-se em meio à completa confusão de todos os sentidos.

Com o último olhar percebeu ainda como a porta do quarto fora escancarada e a mãe, em trajes íntimos, precipitou-se para fora, correndo ao encontro do pai, implorando pela vida de Gregor.

A grave ferida de Gregor, de que sofreu mais de um mês — ninguém se atrevia a retirar a maçã, que permaneceu como lembrança visível encravada na carne —, parecia ter recordado até ao pai que Gregor, a despeito da sua triste figura atual, era um membro da família que não devia ser tratado como um inimigo, mas perante o qual o dever familiar impunha calar a aversão e tolerar, nada mais que tolerar.`
      },
      {
        id: 'meta-5',
        title: 'V - A melodia do violino',
        content: `Uma noite ouviu-se no quarto ao lado o som do violino. Os três inquilinos que a família admitira para custear as despesas haviam pedido que Grete tocasse para eles na sala de estar.

Gregor, atraído pela melodia com uma saudade inexplicável, avançou um pouco mais e já mantinha a cabeça dentro da sala. Quase não se admirava do fato de haver ultimamente tão pouca consideração pelos outros; antes, esse escrúpulo tinha sido seu orgulho. Estaria ele embrutecido, a ponto de a música o tocar tão intimamente? Sentia como se lhe mostrasse o caminho para o alimento desconhecido e tão ansiosamente esperado.

Estava decidido a arrastar-se até a irmã, puxá-la pela saia e indicar-lhe com isso que ela podia vir com seu violino para o seu quarto, já que ninguém aqui recompensava o seu toque como ele queria fazê-lo. A sua figura devia pela primeira vez ter alguma utilidade para ela.`
      },
      {
        id: 'meta-6',
        title: 'VI - O último suspiro e a paz',
        content: `Permaneceu nesse estado de meditação vazia e pacífica até o relógio da torre dar três horas da manhã. O início da claridade geral lá fora diante da janela foi ainda percebido por ele.

Depois a sua cabeça tombou inteiramente sem vontade sobre o chão e de suas narinas desprendeu-se debilmente seu último suspiro.

Quando a criada entrou pela manhãzinha cedo e viu a figura estendida, chamou a família com assombro. Gregor pensara na sua família com ternura e amor. Sua opinião de que precisava desaparecer era se possível ainda mais firme que a da sua irmã. O sol iluminava a nova manhã límpida de primavera, enquanto os três desciam para a carruagem, iniciando juntos um futuro novo e esperançoso.`
      }
    ]
  },
  {
    id: 'o-principe',
    title: 'O Príncipe',
    author: 'Nicolau Maquiavel',
    genre: 'Filosofia Política',
    description: 'Tratado clássico sobre a conquista, manutenção e consolidação do poder político, a virtù do governante e as forças da fortuna.',
    coverUrl: '/src/assets/images/cover_o_principe_1790291724695.jpg',
    totalPages: 6,
    currentPage: 2,
    format: 'txt',
    status: 'reading',
    rating: 4,
    favorite: false,
    shelf: 'Estudo & Política',
    dateAdded: '2026-09-05T09:00:00.000Z',
    lastReadDate: '2026-09-21T16:15:00.000Z',
    readingSessions: [
      { date: '2026-09-18', pagesRead: 1, durationMinutes: 30 },
      { date: '2026-09-21', pagesRead: 1, durationMinutes: 35 },
    ],
    bookmarks: [
      {
        id: 'bm-prince-1',
        page: 5,
        chapterTitle: 'Capítulo V: Da crueldade e da piedade',
        label: 'Ser temido ou ser amado',
        createdAt: '2026-09-21T16:20:00.000Z',
      },
    ],
    notes: [
      {
        id: 'n-prince-1',
        page: 5,
        quote: 'Nasce daí a questão: se é melhor ser amado do que temido, ou o inverso.',
        note: 'Maquiavel conclui que, sendo difícil conciliar ambos, é muito mais seguro ser temido do que amado, desde que evite o ódio.',
        createdAt: '2026-09-21T16:22:00.000Z',
        color: 'rose',
      },
    ],
    chapters: [
      {
        id: 'pr-1',
        title: 'I - De quantas espécies são os principados',
        content: `Todos os Estados, todos os domínios que tiveram e têm autoridade sobre os homens foram e são repúblicas ou principados. Os principados ou são hereditários, nos quais a estirpe do seu senhor é nobre há muito tempo, ou são novos.

Os novos ou são inteiramente novos, como foi Milão para Francisco Sforza, ou são como membros agregados ao Estado hereditário do príncipe que os adquire, como é o reino de Nápoles para o rei da Espanha.

Estes domínios assim adquiridos ou estão acostumados a viver sob um príncipe, ou estão habituados à liberdade; e adquirem-se ou com as armas de outrem ou com as próprias, ou pela fortuna ou pela virtù. Nos principados hereditários, a dificuldade em mantê-los é muito menor que nos novos, bastando não alterar os costumes ancestrais.`
      },
      {
        id: 'pr-2',
        title: 'II - Dos principados hereditários',
        content: `Digo, pois, que nos Estados hereditários e afeitos à linhagem de seus príncipes, as dificuldades para conservá-los são muito menores do que nos novos, porque basta apenas não transgredir os costumes dos antepassados e, além disso, contemporizar com os acontecimentos imprevistos.

Desse modo, se o príncipe possuir capacidade ordinária, conservar-se-á sempre no seu Estado, a menos que uma força extraordinária e excessiva dele o prive. E, uma vez privado do seu domínio, com qualquer revés sofrido pelo usurpador, ele o reconquistará.

O governante natural tem menores motivos e menor necessidade de ofender os seus súditos; daí resulta que deve ser mais benquisto; e se vícios extraordinários não o tornam odiado, é razoável que naturalmente conte com a boa vontade dos seus povos.`
      },
      {
        id: 'pr-3',
        title: 'III - Das armas próprias e da virtù',
        content: `Não se devem considerar os homens pelas coisas que poderiam ser, mas por aquilo que realmente são. Aqueles que, pela sua própria virtù semelhante aos grandes exemplos da antiguidade, tornam-se príncipes, adquirem o domínio com dificuldade, mas o conservam com facilidade.

As dificuldades que encontram para conquistar nascem em parte das novas leis e ordenações que são obrigados a introduzir para fundar o seu Estado e a sua segurança.

E deve-se notar que não há coisa mais difícil de tratar, nem mais duvidosa de conseguir, nem mais perigosa de conduzir do que fazer-se chefe da introdução de novas ordens. Porque o introdutor tem por inimigos todos aqueles que se beneficiavam das antigas leis, e defensores frívolos naqueles que se beneficiariam das novas.`
      },
      {
        id: 'pr-4',
        title: 'IV - Da verdade efetiva das coisas',
        content: `Resta agora ver quais devem ser os modos e procedimentos de um príncipe para com os seus súditos e com os seus amigos. E porque sei que muitos escreveram sobre isto, temo que, escrevendo eu também, seja considerado presunçoso, afastando-me dos métodos seguidos pelos outros.

Sendo a minha intenção escrever coisa útil a quem a compreenda, pareceu-me mais conveniente ir direto à verdade efetiva das coisas do que à imaginação sobre as mesmas. Muitos imaginaram repúblicas e principados que nunca se viram nem se soube que existissem na verdade.

Há uma distância tão grande entre como se vive e como se deveria viver, que aquele que abandona o que se faz pelo que se deveria fazer aprende antes a arruinar-se do que a salvar-se; pois o homem que quiser fazer profissão de bondade há de perder-se em meio a tantos que não são bons.`
      },
      {
        id: 'pr-5',
        title: 'V - Da crueldade e da piedade',
        content: `Descendo às outras qualidades antes mencionadas, digo que todo príncipe deve desejar ser tido como piedoso e não cruel; contudo, deve ter o cuidado de não fazer mau uso dessa piedade. César Bórgia era considerado cruel; todavia, a sua crueldade reconciliou a Romagna, uniu-a e reduziu-a à paz e à lealdade.

Nasce daí uma dúvida: se é melhor ser amado do que temido, ou o inverso. A resposta é que seria de desejar ser ambas as coisas; mas, como é difícil reuni-las, é muito mais seguro ser temido do que amado, quando se tenha de faltar a uma das duas.

Porque dos homens em geral se pode dizer isto: que são ingratos, volúveis, simuladores, covardes perante o perigo e ávidos de lucro; e enquanto lhes fazes bem, são inteiramente teus; mas quando a necessidade se avizinha, eles se revoltam.`
      },
      {
        id: 'pr-6',
        title: 'VI - De como os príncipes mantêm a palavra',
        content: `Quanto seja louvável em um governante manter a palavra e viver com integridade e não com astúcia, todos o compreendem. Contudo, vê-se por experiência nos nossos tempos que os príncipes que fizeram grandes coisas foram aqueles que deram pouca importância à palavra dada.

Deveis saber, pois, que existem dois modos de combater: um com as leis, o outro com a força. O primeiro é próprio do homem, o segundo é próprio dos animais; mas como muitas vezes o primeiro não basta, convém recorrer ao segundo.

Portanto, é necessário a um governante saber usar bem o animal e o homem. Sendo preciso a um príncipe saber usar bem a natureza do animal, deve escolher a raposa e o leão; pois o leão não sabe se defender dos laços, e a raposa não sabe se defender dos lobos. É preciso ser raposa para conhecer os laços e leão para aterrorizar os lobos.`
      }
    ]
  },
  {
    id: 'o-pequeno-principe',
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    genre: 'Fábula & Filosofia',
    description: 'Um piloto perdido no deserto do Saara conhece um pequeno príncipe de outro planeta, descobrindo o valor dos laços, do amor, da amizade e da imaginação.',
    coverUrl: '/src/assets/images/cover_pequeno_principe_1790291734155.jpg',
    totalPages: 6,
    currentPage: 0,
    format: 'txt',
    status: 'want_to_read',
    rating: 5,
    favorite: true,
    shelf: 'Clássicos Poéticos',
    dateAdded: '2026-09-12T11:20:00.000Z',
    bookmarks: [],
    notes: [],
    chapters: [
      {
        id: 'pp-1',
        title: 'I - A jiboia e o chapéu',
        content: `Certa vez, quando eu tinha seis anos, vi num livro sobre a Floresta Virgem, chamado "Histórias Vividas", uma linda gravura. Representava uma jiboia engolindo uma fera.

Dizia o livro: "As jiboias engolem a presa inteira, sem mastigar. Em seguida, não conseguem se mover e dormem durante os seis meses da digestão." Pensei muito então sobre as aventuras da selva e, com um lápis de cor, consegui traçar o meu primeiro desenho.

Mostrei minha obra de arte às pessoas grandes e perguntei se meu desenho lhes dava medo. Responderam-me: "Por que um chapéu daria medo?" Meu desenho não representava um chapéu. Representava uma jiboia digerindo um elefante. Desenhei então o interior da jiboia, para que as pessoas grandes pudessem compreender. Elas têm sempre necessidade de explicações.`
      },
      {
        id: 'pp-2',
        title: 'II - O carneiro no deserto',
        content: `Vivi assim, só, sem ninguém com quem pudesse verdadeiramente conversar, até uma pane no deserto do Saara, há seis anos. Qualquer coisa se quebrara no meu motor. E como não levava comigo mecânico nem passageiro, preparei-me para tentar sozinho um conserto difícil. Era para mim questão de vida ou morte.

Na primeira noite, adormeci pois na areia, a mil milhas de qualquer terra habitada. Estava mais isolado que um náufrago numa tábua no meio do oceano. Imaginem então a minha surpresa quando, ao romper do dia, uma vozinha graciosa me acordou dizendo:

— Por favor... desenha-me um carneiro!
— Hein?
— Desenha-me um carneiro...
Pus-me de pé, como atingido por um raio. Esfreguei bem os olhos e olhei em volta. E vi um extraordinário pedacinho de gente que me examinava com gravidade.`
      },
      {
        id: 'pp-3',
        title: 'III - O asteroide e os baobás',
        content: `Eu soubera assim de uma segunda coisa importantíssima: o planeta de onde ele vinha era pouco maior que uma casa! Isso não me causou muita surpresa. Sabia bem que, além dos grandes planetas como a Terra, Júpiter, Marte ou Vênus, aos quais demos nomes, há centenas de outros, tão pequenos às vezes que a custo se veem no telescópio.

Quando um astrônomo descobre um deles, dá-lhe por nome um número. Chama-o, por exemplo: "asteroide 3251". Tenho sérias razões para acreditar que o planeta de onde vinha o príncipe era o asteroide B-612.

No planeta do pequeno príncipe havia, como em todos os planetas, ervas boas e ervas más. E sementes terríveis no planeta do principezinho eram as sementes de baobá. O solo estava infestado. Ora, um baobá, se a gente descobre muito tarde, nunca mais consegue se livrar dele. Atravessa-o com as raízes. E se o planeta é pequeno e os baobás são numerosos, eles o fazem estourar.`
      },
      {
        id: 'pp-4',
        title: 'IV - A raposa e o criar de laços',
        content: `Foi então que apareceu a raposa:
— Bom dia — disse a raposa.
— Bom dia — respondeu polidamente o pequeno príncipe, que se virou, mas não viu nada.
— Estou aqui — disse a voz —, debaixo da macieira...
— Quem és tu? — perguntou o pequeno príncipe. — Tu és bem bonita...
— Sou uma raposa — disse ela.
— Vem brincar comigo — propôs o pequeno príncipe. — Estou tão triste...

— Eu não posso brincar contigo — disse a raposa. — Não fui cativada.
— O que significa "cativar"? — perguntou ele.
— É uma coisa muito esquecida — disse a raposa. — Significa "criar laços..." Tu ainda não és para mim senão um garoto igual a cem mil outros garotos. E eu não tenho necessidade de ti. Mas, se tu me cativas, nós teremos necessidade um do outro. Serás para mim único no mundo. E eu serei para ti única no mundo...`
      },
      {
        id: 'pp-5',
        title: 'V - O segredo do coração',
        content: `Assim o pequeno príncipe cativou a raposa. E quando chegou a hora da despedida:
— Ah! — disse a raposa. — Eu vou chorar.
— A culpa é tua — disse o principezinho. — Eu não te desejava mal nenhum, mas tu quiseste que eu te cativasse...
— Quis — disse a raposa.
— Mas tu vais chorar! — disse ele.
— Vou — disse a raposa.
— Então não ganhaste nada!

— Ganhei — disse a raposa —, por causa da cor do trigo. Vai rever as rosas. Tu compreenderás que a tua rosa é a única no mundo. Tu voltarás para me dizer adeus, e eu te darei de presente um segredo.

E quando ele voltou:
— Adeus — disse a raposa. — Eis o meu segredo. É muito simples: só se vê bem com o coração. O essencial é invisível para os olhos. Foi o tempo que perdeste com a tua rosa que fez a tua rosa tão importante. Tu te tornas eternamente responsável por aquilo que cativas.`
      },
      {
        id: 'pp-6',
        title: 'VI - As estrelas que sabem rir',
        content: `Naquela noite não o vi pôr-se a caminho. Ele partiu sem ruído. Quando consegui alcançá-lo, caminhava decidido, com passo rápido. Disse-me apenas:
— Ah! Estás aí...
E pegou-me pela mão. Mas continuava atormentado:
— Fizeste mal em vir. Vais ter pena. Eu parecerei morto, e isso não será verdade... Compreendes? É longe demais. Eu não posso carregar este corpo. É pesado demais. Mas será como uma velha casca abandonada. Não têm nada de triste as velhas cascas...

E acrescentou com um sorriso:
— As pessoas têm estrelas que não são as mesmas. Para uns, que viajam, as estrelas são guias. Para outros, não passam de pequenas luzes. Para os sábios, são problemas. Mas todas essas estrelas se calam. Tu, porém, terás estrelas como ninguém nunca teve... Quando olhares o céu à noite, como eu habitarei numa delas, como eu estarei rindo numa delas, será para ti como se todas as estrelas rissem. Tu terás estrelas que sabem rir!`
      }
    ]
  }
];

export const PRESET_GENRES = [
  'Todos',
  'Clássicos Brasileiros',
  'Ficção & Existencialismo',
  'Filosofia Política',
  'Fábula & Filosofia',
  'Ficção Científica',
  'Fantasia',
  'Desenvolvimento Pessoal',
  'História & Biografia',
  'Tecnologia',
  'Poesia',
  'Suspense & Mistério'
];
