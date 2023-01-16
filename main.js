(function () {
  console.log('script is running...');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  const canvas_zoom = 1.5;
  const img_width = 380;
  const img_height = 445;

  let particles = [];
  let mappedImage = [];
  let raf;
  let raf_2;

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

  img.src = 'Meisje_met_de_parel.jpg';
  img.onload = () => {
    ctx.globalAlpha = 1;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
  const paras = document.querySelectorAll('p');
  const set_para_active = (step) => {
    paras.forEach((para) => para.removeAttribute('class', 'active'));
    paras[step - 1].setAttribute('class', 'active');
  };

  // steps
  const step_1 = () => {
    console.log('step_1 is running');
    set_para_active(1);
    clearCanvas();
    draw_img();
  };
  const step_2 = () => {
    console.log('step_2 is running');
    set_para_active(2);
    clearCanvas();
    draw_img();
    draw_grid();
  };
  const step_3 = () => {
    console.log('step_3 is running');
    set_para_active(3);
    cancelAnimationFrame(raf);
    no_particles();
    clearCanvas();
    draw_img();
    get_pixels_brightness();
  };

  class Particle {
    constructor() {
      this.x = 0;
      this.y = Math.random() * canvas.height;
      this.speed = 3;
      this.velocity = Math.random() * 4;
      this.size = Math.random() * 1.5 + 1;
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
    }

    update(speed) {
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      this.speed = speed;
      let movement = 1.5 - this.speed + this.velocity;
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

  const animate = () => {
    clearCanvas();
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgb(1,1,1)';
    particles.forEach((particle) => {
      console.log('animating...');
      particle.update(1);
      ctx.globalAlpha = particle.speed;
      particle.draw();
    });
    raf = requestAnimationFrame(animate);
  };

  const step_4 = () => {
    console.log('step_4 is running');
    set_para_active(4);
    clearCanvas();
    fill_particles(200);
    console.log(particles.length);
    animate();
  };

  const animate_2 = () => {
    draw_img();
    ctx.globalAlpha = 0.01;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(1,1,1)';
    particles.forEach((particle) => {
      console.log('animating...');
      particle.update(mappedImage[this.position1][this.position2][0]);
      ctx.globalAlpha = particle.speed;
      particle.draw();
    });
    raf_2 = requestAnimationFrame(animate_2);
  };

  const img_mapper = () => {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++) {
      let row = [];
      for (let x = 0; x < canvas.width; x++) {
        const r = pixels.data[y * 4 * pixels.width + x * 4];
        const g = pixels.data[y * 4 * pixels.width + (x * 4 + 1)];
        const b = pixels.data[y * 4 * pixels.width + (x * 4 + 2)];
        const brightness = cal_rel_brightness(r, g, b);
        const cell = [brightness];
        row.push(cell);
      }
      mappedImage.push(row);
    }
    console.log(mappedImage);
  };

  const step_5 = () => {
    console.log('step_5 is running');
    set_para_active(5);
    no_particles();
    cancelAnimationFrame(raf);
    fill_particles(200);
    img_mapper();
    animate_2();
  };
  const step_6 = () => {
    console.log('step_6 is running');
    set_para_active(6);
  };
  const step_7 = () => {
    console.log('step_7 is running');
    set_para_active(7);
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
