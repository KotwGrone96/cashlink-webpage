/**
 * @param {string} value 
 * @returns {string | boolean}
 */

function validarSeleccion(value){
	if(value.length === 0){
		Swal.fire({
			title: 'Debe indicar un valor',
			icon: 'error',
			confirmButtonText: 'Aceptar',
		})
		return false
	}
	const RECHAZAR = ['Desempleado','Empleado Doméstico','Monotributista']
	const ENVIAR_LINK = ['Empleado Privado']
	const LINK = 'https://www.adelantos.com.ar/registrarme?utm_source=Pluscredit&utm_medium=referral&utm_campaign=Pluscredit'

	if(RECHAZAR.includes(value)){
		return false
	}
	if(ENVIAR_LINK.includes(value)){
		return LINK
	}
	return true
}