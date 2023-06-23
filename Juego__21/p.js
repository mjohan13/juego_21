class BJGame {
    constructor() {
      this.deckId = null;
      this.victorias = 0;
      this.derrotas = 0;
      this.empates = 0;
      this.jugador = new Jugador('jugador: ', '#puntos-tuyos', '#tus-cartas');
      this.crupier = new Jugador('Crupier: ', '#puntos-crupier', '#cartas-crupier');
      this.cartasUsadasJugador = [];
      this.cartasUsadasCrupier = [];
    }
  
    async crearMazo() {
      const respuesta = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      const datos = await respuesta.json();
      this.deckId = datos.deck_id;
    }
  
    async tomarCarta(jugador) {
      const respuesta = await fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`);
      const datos = await respuesta.json();
      const carta = datos.cards[0];
      jugador.mano.push(carta);
      this.mostrarCarta(carta, jugador);
      jugador.puntos += this.obtenerValorCarta(carta.value);
      document.querySelector(jugador.puntosSpan).textContent = `Puntos ${jugador.nombre}: ${jugador.puntos}`;
    
      if (jugador === this.jugador) {
        this.cartasUsadasJugador.push(carta);
      } else if (jugador === this.crupier) {
        this.cartasUsadasCrupier.push(carta);
      }
    }
    
    mostrarCartasUsadas() {
      console.log('Cartas usadas por el jugador:');
      console.log(this.cartasUsadasJugador);
  
      console.log('Cartas usadas por el crupier:');
      console.log(this.cartasUsadasCrupier);
      
    }
    

    obtenerValorCarta(valor) {
      switch (valor) {
        case 'ACE':
          return 1;
        case 'KING':
        case 'QUEEN':
        case 'JACK':
          return 10;
        default:
          return parseInt(valor);
      }
    }
  
    mostrarCarta(carta, jugador) {
      const imagenCarta = document.createElement('img');
      imagenCarta.src = carta.image;
      document.querySelector(jugador.divCartas).appendChild(imagenCarta);
    }
  
    limpiarCartas() {
      const tusCartasDiv = document.querySelector('#tus-cartas');
      const cartasCrupierDiv = document.querySelector('#cartas-crupier');
      tusCartasDiv.innerHTML = '';
      cartasCrupierDiv.innerHTML = '';
    }
  
    reiniciarPuntos() {
      this.jugador.puntos = 0;
      this.crupier.puntos = 0;
      document.querySelector(this.jugador.puntosSpan).textContent = this.jugador.puntos
      document.querySelector(this.crupier.puntosSpan).textContent = this.crupier.puntos
    }
  
    reiniciarJuego() {
      this.limpiarCartas();
      this.reiniciarPuntos();
      this.jugador.mano = [];
      this.crupier.mano = [];
      document.querySelector('#mensaje').textContent = '';
      document.querySelector('#repartir').disabled = false;
      document.querySelector('#tomar').disabled = true;
      document.querySelector('#plantarse').disabled = true;
    }
  
    async iniciarJuego() {
      this.reiniciarJuego();
  
      document.querySelector('#mensaje').textContent = 'Repartiendo cartas...';
      document.querySelector('#mensaje').style.color = 'black';
  
      await this.crearMazo();
  
      await this.tomarCarta(this.jugador);
      await this.tomarCarta(this.jugador);
  
      await
  
   this.tomarCarta(this.crupier);
      await this.tomarCarta(this.crupier);
  
      document.querySelector('#mensaje').textContent = '¿Tomar carta o plantarse?';
      document.querySelector('#tomar').disabled = false;
      document.querySelector('#plantarse').disabled = false;
    }
  
    async tomarCartaJugador() {
      await this.tomarCarta(this.jugador);
  
      if (this.jugador.puntos === 21) {
        this.plantarse();
      } else if (this.jugador.puntos > 21) {
        this.plantarse();
      }
    }
  
    plantarse() {
      document.querySelector('#tomar').disabled = true;
      document.querySelector('#plantarse').disabled = true;
      document.querySelector('#finalizar').disabled = false;
      
  
      this.turnoCrupier();
    }
  
    async turnoCrupier() {
      while (this.crupier.puntos < 17) {
        await this.tomarCarta(this.crupier);
      }
  
      this.calcularResultado();
    }
  
    calcularResultado() {
      if (this.jugador.puntos > 21) {
        this.derrotas++;
        document.querySelector('#mensaje').textContent = 'Perdiste. Te has pasado de 21.';
        document.querySelector('#mensaje').style.color = 'blue';
      } else if (this.crupier.puntos > 21) {
        this.victorias++;
        document.querySelector('#mensaje').textContent = '¡Ganaste! El crupier se ha pasado de 21.';
        document.querySelector('#mensaje').style.color = 'green';
      } else if (this.jugador.puntos === this.crupier.puntos) {
        this.empates++;
        document.querySelector('#mensaje').textContent = '¡Empate!';
        document.querySelector('#mensaje').style.color = 'orange';
      } else if (this.jugador.puntos > this.crupier.puntos) {
        this.victorias++;
        document.querySelector('#mensaje').textContent = '¡Ganaste! Tu puntuación es mayor que la del crupier.';
        document.querySelector('#mensaje').style.color = 'green';
      } else {
        this.derrotas++;
        document.querySelector('#mensaje').textContent = 'Perdiste. La puntuación del crupier es mayor.';
        document.querySelector('#mensaje').style.color = 'blue';
      }
  
      this.actualizarMarcador();
      this.actualizarMarcador();
      this.mostrarCartasUsadas();
    }
  
    actualizarMarcador() {
      document.querySelector('#victorias').textContent = `Victorias: ${this.victorias}`;
      document.querySelector('#derrotas').textContent = `Derrotas: ${this.derrotas}`;
      document.querySelector('#empates').textContent = `Empates: ${this.empates}`;
    }

    verificarGanador() {
      if (this.derrotas > this.victorias) {
        document.querySelector('#mensaje').textContent = '¡Perdiste! tienes más derrotas que victorias.';
        document.querySelector('#mensaje').style.color = 'yelow';
      } else if (this.victorias > this.derrotas) {
        document.querySelector('#mensaje').textContent = '¡Ganaste! tienes más victorias que derrotas.';
        document.querySelector('#mensaje').style.color = 'green';
      } else {
        document.querySelector('#mensaje').textContent = 'Hubo un empate.';
        document.querySelector('#mensaje').style.color = 'orange';
      }
    }
    
  }
  
  class Jugador {
    constructor(nombre, puntosSpan, divCartas) {
      this.nombre = nombre;
      this.puntos = 0;
      this.mano = [];
      this.puntosSpan = puntosSpan;
      this.divCartas = divCartas;
    }
  }
  
  const juego = new BJGame();
  
  document.querySelector('#repartir').addEventListener('click', async () => {
    await juego.iniciarJuego()
  })
  
  document.querySelector('#tomar').addEventListener('click', async () => {
    await juego.tomarCartaJugador()
  })
  
  document.querySelector('#plantarse').addEventListener('click', () => {
    juego.plantarse()
  })
  
  function mostrarMarcador() {
    const marcadorDiv = document.querySelector('.marcador');
    marcadorDiv.style.display = 'block';
    const mensaje = document.querySelector('#mensaje');
    mensaje.textContent = ''
    const reiniciarBtn = document.querySelector('#reiniciar');
    reiniciarBtn.disabled = false;
  }

  document.querySelector('#finalizar').addEventListener('click', () => {
    mostrarMarcador()
    juego.verificarGanador()
  })

  document.querySelector('#reiniciar').addEventListener('click', () => {
    location.reload()
  })
  
  