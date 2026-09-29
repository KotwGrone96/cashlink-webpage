var modal = document.getElementById('myModal')
var buttons = document.querySelectorAll('.cta-button-actions')
var span = document.getElementsByClassName('close')[0]

function getCookie(name) {
	const cookies = document.cookie.split('; ')
	for (let cookie of cookies) {
		let [key, value] = cookie.split('=')
		if (key === name) {
			return value
		}
	}
	return null
}

buttons.forEach(function (button) {
	button.onclick = function (event) {
		event.preventDefault()
		modal.style.display = 'block'
	}
})

span.onclick = function () {
	modal.style.display = 'none'
	document.getElementById('loanForm').reset()
	currentStep = 1
	showStep(currentStep)
}

window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = 'none'
		document.getElementById('loanForm').reset()
		currentStep = 1
		showStep(currentStep)
	}
}

var currentStep = 1
var stepCompleted = [false, false, false]

function showStep(step) {
	document.querySelectorAll('.step').forEach(function (el) {
		el.classList.remove('active')
	})
	document.getElementById('step' + step).classList.add('active')

	const modalTitleElement = document.getElementById('modal-title')
	if (modalTitleElement) {
		modalTitleElement.innerText = 'Paso ' + step
	}

	document
		.querySelectorAll('.step-indicator')
		.forEach(function (indicator, index) {
			indicator.classList.remove('active-step', 'completed-step', 'next-step')

			if (index + 1 < step) {
				indicator.classList.add('completed-step')
				stepCompleted[index] = true
			} else if (index + 1 === step) {
				indicator.classList.add('active-step')
			} else {
				indicator.classList.add('next-step')
			}
		})
}

showStep(currentStep)

function formatToDollars(input) {
	var value = input.value.replace(/[^0-9]/g, '')
	if (value) {
		input.value =
			'$' +
			parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 0 })
	} else {
		input.value = ''
	}
}

document.getElementById('nextBtn1').onclick = function () {
	var amount = document.getElementById('amount').value.replace(/[$,]/g, '')
	var isValid = true

	// Validate amount
	if (!/^\d+(\.\d{1,2})?$/.test(amount) || parseFloat(amount) <= 0) {
		document.getElementById('amountError').style.display = 'block'
		isValid = false
	} else {
		document.getElementById('amountError').style.display = 'none'
	}

	if (!document.getElementById('firstName').value) {
		document.getElementById('firstNameError').style.display = 'block'
		isValid = false
	} else {
		document.getElementById('firstNameError').style.display = 'none'
	}

	if (!document.getElementById('lastName').value) {
		document.getElementById('lastNameError').style.display = 'block'
		isValid = false
	} else {
		document.getElementById('lastNameError').style.display = 'none'
	}

	if (document.getElementById('dni').value.length !== 8) {
		document.getElementById('dniError').style.display = 'block'
		isValid = false
	} else {
		document.getElementById('dniError').style.display = 'none'
	}

	if (isValid) {
		stepCompleted[0] = true
		currentStep++
		showStep(currentStep)
	}
}

function obtenerQueryParams() {
	// 1. Creamos una instancia de URLSearchParams con la cadena de búsqueda
	const urlParams = new URLSearchParams(window.location.search)

	// 2. Usamos Object.fromEntries para convertirlo directamente a un objeto
	return Object.fromEntries(urlParams)
}

document.getElementById('loanForm').onsubmit  = function (e) {
	e.preventDefault()
	var submitButton = document.getElementById('submitBtn')
	var isValid = true

	if (!document.getElementById('destination').value) {
		document.getElementById('destinationError').style.display = 'block'
		isValid = false
	} else {
		document.getElementById('destinationError').style.display = 'none'
	}

	if (!document.getElementById('bank').value) {
		document.getElementById('bankError').style.display = 'block'
		isValid = false
	} else {
		document.getElementById('bankError').style.display = 'none'
	}

	if (!document.getElementById('occupation').value) {
		document.getElementById('occupationError').style.display = 'block'
		isValid = false
	} else {
		document.getElementById('occupationError').style.display = 'none'
	}

	if (isValid) {
		if (getCookie('registro')) {
			Swal.fire({
				title: 'Solicitud registrada recientemente.',
				text: 'Debe esperar para poder enviar otra solicitud.',
				icon: 'error',
				confirmButtonText: 'Aceptar',
			})
			return
		}

		submitButton.innerText = 'Enviando datos'
		submitButton.disabled = true
		const nombre = document.getElementById('firstName').value
		const apellido = document.getElementById('lastName').value
		const dni = document.getElementById('dni').value
		const telefono = document.getElementById('phone').value
		const correo = document.getElementById('email').value
		const monto = document
			.getElementById('amount')
			.value.replaceAll('$', '')
			.replaceAll(',', '')
			.replaceAll('.', '')

		const provinciaSelect = document.getElementById('province')
		const provincia = provinciaSelect.value
		const provincia_label =
			provinciaSelect.options[provinciaSelect.selectedIndex].text

		const sexoSelect = document.getElementById('gender')
		const sexo = sexoSelect.value
		const sexo_label = sexoSelect.options[sexoSelect.selectedIndex].text

		const destinoSelect = document.getElementById('destination')
		const destino_prestamo = destinoSelect.value
		const destino_prestamo_label =
			destinoSelect.options[destinoSelect.selectedIndex].text

		const bcoSelect = document.getElementById('bank')
		const bco_cobro = bcoSelect.value
		const bco_cobro_label = bcoSelect.options[bcoSelect.selectedIndex].text

		const empleoSelect = document.getElementById('occupation')
		const empleo = empleoSelect.value
		const empleo_label = empleoSelect.options[empleoSelect.selectedIndex].text

		const payload = {
			nombre,
			apellido,
			dni,
			telefono,
			correo,
			provincia,
			provincia_label,
			monto,
			sexo,
			sexo_label,
			destino_prestamo,
			destino_prestamo_label,
			bco_cobro,
			bco_cobro_label,
			empleo,
			empleo_label,
		}

		payload['search_params'] = obtenerQueryParams()

		const apiLink = 
			'https://leads.back.cashlink-ya.com.ar/api/leads/createFromWebPage'
		//const apiLink = 'http://127.0.0.1:3001/api/leads/createFromWebPage'

		fetch(apiLink, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: 'Bearer|@C45hl1nk@',
			},
			body: JSON.stringify(payload),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.ok === true) {
					submitButton.disabled = false
					// --- NUEVA LÓGICA DE REDIRECCIÓN A WHATSAPP ---

					const empleoSeleccion = validarSeleccion(String(empleo)) 

					if(typeof empleoSeleccion === 'string'){
						Swal.fire({
							title: 'Solicitud Registrada',
							text: 'Serás redirigido a nuestro portal de préstamos.',
							icon: 'success',
							showConfirmButton: false,
							timer: 2500
						}).then((s)=>{
							modal.style.display = 'none'
							window.open(empleoSeleccion,'_blank')
						})

					}
					if(typeof empleoSeleccion === 'boolean' && empleoSeleccion === true){
						Swal.fire({
							title: 'Solicitud Registrada',
							text: 'Serás redirigido a nuestro chat de WhatsApp.',
							icon: 'success',
							showConfirmButton: false,
							timer: 2500
						}).then((s)=>{
							const numeroTelefono = '5491150215049'
							const mensajeTexto = 'Hola! Vengo por mi préstamo.'
							//encodeURIComponent se encarga de convertir los espacios y el emoji a formato URL válido
							const whatsappUrl = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensajeTexto)}`
							
							// Abre en pestaña nueva (en Desktop) o redirige a la App (en Celular)
							modal.style.display = 'none'
							window.open(whatsappUrl, '_blank')
						})
					}

					if(!empleoSeleccion){
						modal.style.display = 'none'
						Swal.fire({
							title: 'Solicitud Registrada',
							text:'Nos pondremos en contacto con usted',
							icon: 'success',
							confirmButtonText: 'Aceptar',
						})
					}

					// ----------------------------------------------

					document.getElementById('loanForm').reset()
					currentStep = 1
					showStep(currentStep)
					modal.style.display = 'none'
					document.cookie = 'registro=1; max-age=60; path=/'

					fetch('https://apis.ipcall.com.ar/v1/leads/web', {
						method: 'POST',
						headers: {
							AppID: 3,
							Authorization:
								'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJleHAiOjIwNTY2Mjk3MDMsInVzZXIiOiJDdWVudGE6NTAwMjItQXBwOjMtS2V5OkQ2OUZCMERFLTY5M0MtNDE3RS05ODU4LTQwRTlGNjVEODAxOSJ9.b2i6v9U_t5MpThoamLd3Z1gwZMwwnUpR4Y5bVfi1Ls4',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							leads_id: data.lead.id,
							contacto: `${nombre} ${apellido}`,
							telefono,
							dni,
							email: correo,
							ciudad: '',
							cp: '',
							direccion: '',
							provincia: provincia_label,
							pais: 'Argentina',
							procedencia: 'WEB',
							user_provider: 'Web',
							crm_leads_datos: [
								{
									campo: 'monto',
									valor: monto,
								},
								{
									campo: 'sexo_label',
									valor: sexo_label,
								},
								{
									campo: 'destino_prestamo_label',
									valor: destino_prestamo_label,
								},
								{
									campo: 'bco_cobro_label',
									valor: bco_cobro_label,
								},
								{
									campo: 'empleo_label',
									valor: empleo_label,
								},
							],
						}),
					})
						.then((d) => d.json())
						.then((r) => console.log('Lead capturado correctamente'))
						.catch((e) => console.error('Error al capturar el lead', e))
				} else {
					console.log(data)
					submitButton.disabled = false
					Swal.fire({
						title: 'Error',
						text: data.message || 'Por favor intentar luego.',
						icon: 'error',
						confirmButtonText: 'Aceptar',
					})

					submitButton.innerText = 'Enviar formulario'
				}
			})
			.catch((error) => {
				submitButton.disabled = false
				Swal.fire({
					title: 'Error',
					text: 'Hubo un problema en el servidor. Por favor, intenta más tarde.',
					icon: 'error',
					confirmButtonText: 'Aceptar',
				})

				submitButton.innerText = 'Enviar formulario'
				// Resetea el formulario
				document.getElementById('loanForm').reset()
				currentStep = 1
				showStep(currentStep)
				modal.style.display = 'none'
				console.error('Error en la solicitud:', error)
			})
	}
}

document.getElementById('nextBtn2').onclick = function () {
	var isValid = true

	if (!document.getElementById('email').value.includes('@')) {
		document.getElementById('emailError').style.display = 'block'
		isValid = false
	} else {
		document.getElementById('emailError').style.display = 'none'
	}

	if (!document.getElementById('phone').value) {
		document.getElementById('phoneError').style.display = 'block'
		isValid = false
	} else {
		const phoneRegex = /^(?:(?:(?:\+?54)?9?)?0?(?:11(?:15)?\d{8}|[1-9]\d{2}(?:15)?\d{7}|[1-9]\d{3}(?:15)?\d{6}))$/
		if (!phoneRegex.test(document.getElementById('phone').value)) {
			document.getElementById('phoneError').style.display = 'block'
			isValid = false
		} else {
			document.getElementById('phoneError').style.display = 'none'
		}
	}

	if (document.getElementById('province').value === '') {
		document.getElementById('provinceError').style.display = 'block'
		isValid = false
	} else {
		document.getElementById('provinceError').style.display = 'none'
	}

	if (document.getElementById('gender').value === '') {
		document.getElementById('genderError').style.display = 'block'
		isValid = false
	} else {
		document.getElementById('genderError').style.display = 'none'
	}

	if (isValid) {
		stepCompleted[1] = true
		currentStep++
		showStep(currentStep)
	}
}

document.getElementById('stepIndicator1').onclick = function () {
	currentStep = 1
	showStep(currentStep)
}

document.getElementById('stepIndicator2').onclick = function () {
	if (stepCompleted[0]) {
		currentStep = 2
		showStep(currentStep)
	}
}

document.getElementById('stepIndicator3').onclick = function () {
	if (stepCompleted[1]) {
		currentStep = 3
		showStep(currentStep)
	}
}

const prevBtn = document.getElementById('prevBtn')
if (prevBtn) {
	prevBtn.onclick = function () {
		if (currentStep > 1) {
			currentStep--
			showStep(currentStep)
		}
	}
}

const prevBtn2 = document.getElementById('prevBtn2')
if (prevBtn2) {
	prevBtn2.onclick = function () {
		if (currentStep > 2) {
			currentStep--
			showStep(currentStep)
		}
	}
}

showStep(currentStep)

document.addEventListener('DOMContentLoaded', () => {
    const mainActionBtn = document.getElementById('mainActionBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const mainModalForm = document.getElementById('mainModalForm');

    mainActionBtn.addEventListener('click', () => {
        modalOverlay.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
		document.getElementById('mainModalAlert').style.display = 'none'
		document.getElementById('mainModalAlertPhone').style.display = 'none'
        mainModalForm.reset();
    });

	mainModalForm.addEventListener('submit',async(e)=>{
		e.preventDefault()
		const formData = new FormData(e.target)

		const mainModalSelect = formData.get('empleo')
		const telefono = formData.get('telefono')

		if((!mainModalSelect || mainModalSelect.trim().length === 0) && (!telefono || telefono.trim().length === 0)){
			document.getElementById('mainModalAlert').style.display = 'block'
			document.getElementById('mainModalAlertPhone').style.display = 'block'
			return
		}
		document.getElementById('mainModalAlert').style.display = 'none'
		document.getElementById('mainModalAlertPhone').style.display = 'none'

		if(!mainModalSelect || mainModalSelect.trim().length === 0){
			document.getElementById('mainModalAlert').style.display = 'block'
			return
		}

		if(!telefono || telefono.trim().length === 0){
			document.getElementById('mainModalAlertPhone').style.display = 'block'
			return
		}

		document.getElementById('mainModalAlert').style.display = 'none'
		document.getElementById('mainModalAlertPhone').style.display = 'none'

		if(!validarSeleccion(String(mainModalSelect))){
			modalOverlay.style.display = 'none';
			mainModalForm.reset();
			Swal.fire({
				title: 'Solicitud Registrada',
				text:'Nos pondremos en contacto con usted',
				icon: 'success',
				confirmButtonText: 'Aceptar',
			})
			return
		}
		if(typeof validarSeleccion(String(mainModalSelect)) === 'string'){
			modalOverlay.style.display = 'none';
			mainModalForm.reset();
			await Swal.fire({
				title: 'Solicitud Registrada',
				text:'Serás redirigido a nuestro portal de préstamos',
				icon: 'success',
				showConfirmButton: false,
				timer: 2500
			})
			window.open(validarSeleccion(String(mainModalSelect)),'_blank')
			return
		}
		const numeroTelefono = '5491150215049'
		const mensajeTexto = 'Quiero ser asesorado para un préstamo.'
		//encodeURIComponent se encarga de convertir los espacios y el emoji a formato URL válido
		const whatsappUrl = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensajeTexto)}`					
		// Abre en pestaña nueva (en Desktop) o redirige a la App (en Celular)
		modalOverlay.style.display = 'none';
		mainModalForm.reset();
		window.open(whatsappUrl, '_blank')
	})
});
