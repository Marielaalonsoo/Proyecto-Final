package edu.comillas.icai.gitt.pat.spring.PistaPadel.Controlador;

import edu.comillas.icai.gitt.pat.spring.PistaPadel.Excepciones.ExcepcionDatosIncorrectos;
import edu.comillas.icai.gitt.pat.spring.PistaPadel.Modelo.ModeloReserva;
import edu.comillas.icai.gitt.pat.spring.PistaPadel.Modelo.ModeloReservaPatch;
import edu.comillas.icai.gitt.pat.spring.PistaPadel.Modelo.Pista;
import edu.comillas.icai.gitt.pat.spring.PistaPadel.Modelo.Reserva;
import edu.comillas.icai.gitt.pat.spring.PistaPadel.Modelo.Usuario;
import edu.comillas.icai.gitt.pat.spring.PistaPadel.service.ReservaService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/pistaPadel")
public class ReservaController {

    private static final Logger logger = LoggerFactory.getLogger(ReservaController.class);

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping("/reservations")
    public ResponseEntity<?> crearReserva(@Valid @RequestBody ModeloReserva body,
                                          BindingResult br,
                                          Principal principal) {

        if (br.hasErrors()) throw new ExcepcionDatosIncorrectos(br);

        Reserva guardada = reservaService.crearReserva(body, principal);
        logger.info("Reserva creada: idReserva={}", guardada.getIdReserva());

        return ResponseEntity.status(HttpStatus.CREATED).body(reservaToMap(guardada));
    }

    @GetMapping("/reservations")
    public ResponseEntity<?> misReservas(@RequestParam(required = false) String from,
                                         @RequestParam(required = false) String to,
                                         Principal principal) {

        return ResponseEntity.ok(reservasToMap(reservaService.obtenerMisReservas(from, to, principal)));
    }

    @GetMapping("/reservations/{reservationId}")
    public ResponseEntity<?> obtenerReserva(@PathVariable Integer reservationId,
                                            Principal principal) {

        return ResponseEntity.ok(reservaToMap(reservaService.obtenerReserva(reservationId, principal)));
    }

    @DeleteMapping("/reservations/{reservationId}")
    public ResponseEntity<?> cancelarReserva(@PathVariable Integer reservationId,
                                             Principal principal) {

        reservaService.cancelarReserva(reservationId, principal);
        logger.info("Reserva cancelada: idReserva={}", reservationId);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/reservations/{reservationId}")
    public ResponseEntity<?> modificarReserva(@PathVariable Integer reservationId,
                                              @RequestBody ModeloReservaPatch body,
                                              Principal principal) {

        Reserva guardada = reservaService.modificarReserva(reservationId, body, principal);
        logger.info("Reserva modificada: idReserva={}", reservationId);

        return ResponseEntity.ok(reservaToMap(guardada));
    }

    @GetMapping("/admin/reservations")
    public ResponseEntity<?> adminReservas(@RequestParam(required = false) String date,
                                           @RequestParam(required = false) Integer courtId,
                                           @RequestParam(required = false) Integer userId,
                                           Principal principal) {

        return ResponseEntity.ok(reservasToMap(reservaService.obtenerReservasAdmin(date, courtId, userId, principal)));
    }

    @GetMapping("/courts/{courtId}/availability")
    public ResponseEntity<?> disponibilidadPista(@PathVariable int courtId,
                                                 @RequestParam String date) {

        return ResponseEntity.ok(reservasToMap(reservaService.obtenerDisponibilidadPista(courtId, date)));
    }

    @GetMapping("/availability")
    public ResponseEntity<?> disponibilidadGeneral(@RequestParam String date,
                                                   @RequestParam(required = false) Integer courtId) {

        return ResponseEntity.ok(reservasToMap(reservaService.obtenerDisponibilidadGeneral(date, courtId)));
    }

    private List<Map<String, Object>> reservasToMap(List<Reserva> reservas) {
        List<Map<String, Object>> salida = new ArrayList<>();

        for (Reserva reserva : reservas) {
            salida.add(reservaToMap(reserva));
        }

        return salida;
    }

    private Map<String, Object> reservaToMap(Reserva reserva) {
        Map<String, Object> salida = new LinkedHashMap<>();

        salida.put("idReserva", reserva.getIdReserva());
        salida.put("usuario", usuarioToMap(reserva.getUsuario()));
        salida.put("pista", pistaToMap(reserva.getPista()));
        salida.put("fechaReserva", reserva.getFechaReserva());
        salida.put("horaInicio", reserva.getHoraInicio());
        salida.put("horaFin", reserva.getHoraFin());
        salida.put("duracionMinutos", reserva.getDuracionMinutos());
        salida.put("estado", reserva.getEstado());
        salida.put("fechaCreacion", reserva.getFechaCreacion());

        return salida;
    }

    private Map<String, Object> usuarioToMap(Usuario usuario) {
        Map<String, Object> salida = new LinkedHashMap<>();

        salida.put("idUsuario", usuario.getIdUsuario());
        salida.put("nombre", usuario.getNombre());
        salida.put("apellidos", usuario.getApellidos());
        salida.put("email", usuario.getEmail());
        salida.put("telefono", usuario.getTelefono());
        salida.put("rol", usuario.getRol());
        salida.put("activo", usuario.isActivo());

        return salida;
    }

    private Map<String, Object> pistaToMap(Pista pista) {
        Map<String, Object> salida = new LinkedHashMap<>();

        salida.put("idPista", pista.getIdPista());
        salida.put("nombre", pista.getNombre());
        salida.put("ubicacion", pista.getUbicacion());
        salida.put("precioHora", pista.getPrecioHora());
        salida.put("activa", pista.isActiva());
        salida.put("fechaAlta", pista.getFechaAlta());

        return salida;
    }
}
