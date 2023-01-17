(function () {
  console.log('script is running...');

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d'); // get 2d context of canvas
  const img = new Image(); // an image object
  const canvas_zoom = 1.5;
  const img_width = 380;
  const img_height = 445;

  let particles = []; // Array of particles
  let mappedImage = []; // Array of brighten cell

  // animation references
  let raf;
  let raf_2;
  let raf_3;
  let raf_4;

  canvas.width = img_width * canvas_zoom;
  canvas.height = img_height * canvas_zoom;

  // clear particles fill
  const no_particles = () => {
    particles = [];
  };

  // canvas cleaner
  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // create a grid
  const cellSize = 8;
  const grid_padding = 0.4;
  const draw_grid = () => {
    console.log('drawing grid...');
    for (let y = 0; y < canvas.height; y += cellSize) {
      for (let x = 0; x < canvas.width; x += cellSize) {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.35;
        ctx.rect(x + grid_padding, y + grid_padding, cellSize, cellSize);
        ctx.stroke();
        ctx.closePath();
      }
    }
  };

  // image preloader
  const img_preload = () => {
    img.src = 'Meisje_met_de_parel.jpg';
    img.onload = () => {
      ctx.globalAlpha = 1;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  const draw_img = () => {
    ctx.globalAlpha = 1;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  const cal_rel_brightness = (r, g, b) => {
    return (
      ((Math.sqrt(r * r * 0.299 + g * g * 0.587 + b * b * 0.114) * 100) / 255) *
      2.55
    );
  };

  const cal_rel_brightness_2 = (r, g, b) => {
    return Math.sqrt(r * r * 0.299 + g * g * 0.587 + b * b * 0.114) / 100;
  };

  const get_pixels_brightness = () => {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y += cellSize) {
      for (let x = 0; x < canvas.width; x += cellSize) {
        const r = pixels.data[y * 4 * pixels.width + x * 4];
        const g = pixels.data[y * 4 * pixels.width + (x * 4 + 1)];
        const b = pixels.data[y * 4 * pixels.width + (x * 4 + 2)];
        let brightness = Math.floor(cal_rel_brightness(r, g, b));
        console.log(brightness);
        ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
    console.log(pixels);
  };

  // paragraph activator
  const set_para_active = (step) => {
    const paras = document.querySelectorAll('p');
    paras.forEach((para) => para.removeAttribute('class', 'active'));
    paras[step - 1].setAttribute('class', 'active');
  };

  class Particle {
    constructor() {
      this.x = 0;
      this.y = Math.random() * canvas.height;
      this.speed = 0;
      this.velocity = Math.random() * 4.5;
      this.size = Math.random() * 1.5 + 2;
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
    }

    update() {
      this.speed = 1;
      let movement = 1.5 - this.speed + this.velocity;
      this.x += movement;
      if (this.x >= canvas.width) {
        this.x = 0;
        this.y = Math.random() * canvas.height;
      }
    }
    update_2() {
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      this.speed = mappedImage[this.position1][this.position2][0];
      let movement = 1.2 - this.speed + this.velocity;
      this.x += movement;
      if (this.x >= canvas.width) {
        this.x = 0;
        this.y = Math.random() * canvas.height;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const fill_particles = (numberOfParticles) => {
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  };

  // image mapper
  const img_mapper = () => {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++) {
      let row = [];
      for (let x = 0; x < canvas.width; x++) {
        const r = pixels.data[y * 4 * pixels.width + x * 4];
        const g = pixels.data[y * 4 * pixels.width + (x * 4 + 1)];
        const b = pixels.data[y * 4 * pixels.width + (x * 4 + 2)];
        const brightness = cal_rel_brightness_2(r, g, b);
        const cell = [brightness];
        row.push(cell);
      }
      mappedImage.push(row);
    }
    console.log(mappedImage);
  };

  // first animator
  const animate = () => {
    clearCanvas();
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgb(1,1,1)';
    particles.forEach((particle) => {
      console.log('animating...');
      particle.update();
      ctx.globalAlpha = particle.speed;
      particle.draw();
    });
    raf = requestAnimationFrame(animate);
  };

  // second animator
  const animate_2 = () => {
    draw_img();
    ctx.globalAlpha = 1;
    clearCanvas();
    particles.forEach((particle) => {
      console.log('animating...');
      particle.update_2();
      particle.draw();
    });
    raf_2 = requestAnimationFrame(animate_2);
  };

  // third animator
  const animate_3 = () => {
    draw_img();
    clearCanvas();
    particles.forEach((particle) => {
      console.log('animating...');
      particle.update_2();
      ctx.globalAlpha = particle.speed;
      particle.draw();
    });
    raf_3 = requestAnimationFrame(animate_3);
  };

  // fourth animator
  const animate_4 = () => {
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.5;
    particles.forEach((particle) => {
      console.log('animating...');
      particle.update_2();
      ctx.globalAlpha = particle.speed * 0.5;
      particle.draw();
    });
    raf_4 = requestAnimationFrame(animate_4);
  };

  // steps
  const step_1 = () => {
    console.log('step_1 is running');
    set_para_active(1);
    img_preload();
    cancelAnimationFrame(raf);
    cancelAnimationFrame(raf_2);
    cancelAnimationFrame(raf_3);
    cancelAnimationFrame(raf_4);
    clearCanvas();
    draw_img();
  };
  const step_2 = () => {
    console.log('step_2 is running');
    set_para_active(2);
    cancelAnimationFrame(raf);
    cancelAnimationFrame(raf_2);
    cancelAnimationFrame(raf_3);
    cancelAnimationFrame(raf_4);
    clearCanvas();
    draw_img();
    draw_grid();
  };
  const step_3 = () => {
    console.log('step_3 is running');
    set_para_active(3);
    cancelAnimationFrame(raf);
    cancelAnimationFrame(raf_2);
    cancelAnimationFrame(raf_3);
    cancelAnimationFrame(raf_4);
    no_particles();
    clearCanvas();
    draw_img();
    get_pixels_brightness();
  };
  const step_4 = () => {
    console.log('step_4 is running');
    set_para_active(4);
    cancelAnimationFrame(raf_2);
    cancelAnimationFrame(raf_3);
    cancelAnimationFrame(raf_4);
    clearCanvas();
    fill_particles(400);
    console.log(particles.length);
    animate();
  };
  const step_5 = () => {
    console.log('step_5 is running');
    set_para_active(5);
    cancelAnimationFrame(raf);
    cancelAnimationFrame(raf_3);
    cancelAnimationFrame(raf_4);
    no_particles();
    fill_particles(2000);
    draw_img();
    img_mapper();
    animate_2();
  };
  const step_6 = () => {
    console.log('step_6 is running');
    set_para_active(6);
    clearCanvas();
    cancelAnimationFrame(raf);
    cancelAnimationFrame(raf_2);
    cancelAnimationFrame(raf_4);
    no_particles();
    fill_particles(3000);
    draw_img();
    img_mapper();
    animate_3();
  };
  const step_7 = () => {
    console.log('step_7 is running');
    set_para_active(7);
    clearCanvas();
    cancelAnimationFrame(raf);
    cancelAnimationFrame(raf_2);
    cancelAnimationFrame(raf_3);
    no_particles();
    fill_particles(1000);
    draw_img();
    img_mapper();
    animate_4();
  };

  // slider working
  const slider = document.getElementById('slider');
  slider.oninput = () => {
    let slider_val = slider.value;
    switch (Number(slider_val)) {
      case 1:
        console.log('value 1');
        step_1();
        break;
      case 2:
        console.log('value 2');
        step_2();
        break;
      case 3:
        console.log('value 3');
        step_3();
        break;
      case 4:
        console.log('value 4');
        step_4();
        break;
      case 5:
        console.log('value 5');
        step_5();
        break;
      case 6:
        console.log('value 6');
        step_6();
        break;
      case 7:
        console.log('value 7');
        step_7();
    }
    console.log(slider_val);
  };

  // initializer
  const init = () => {
    step_1();
  };

  // initialization
  init();
})();
