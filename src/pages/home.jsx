import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    InputAdornment,
    LinearProgress,
    Menu,
    MenuItem,
    Rating,
    Select,
    TextField
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import logotipo from "../assets/logotipo.svg";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import {Email, Facebook, WhatsApp} from "@mui/icons-material";
import Toast from "./components/toast"; // Componente Toast para mostrar mensajes
import ListadoIdiomas from "./ListaIdiomas";
import {About} from "./view/About";

const seniorityLevels = ["Junior", "Middle", "Semi-senior", "Senior"];

export default function EstimationTool() {
    //const API_URL = "http://18.221.34.229";
    const API_URL = "http://localhost:8082";
    const [task, setTask] = useState("");
    const [estimations, setEstimations] = useState("");
    const [showEstimations, setShowEstimations] = useState(false);
    const [showCopy, setShowCopy] = useState(false);
    const [id, setID] = useState(0);
    const [idLanguage, setIdLanguage] = useState(1);
    const [ratingValue, setRatingValue] = useState(0);
    const [selectedSeniority, setSelectedSeniority] = useState("");
    const [toast, setToast] = useState({ open: false, message: "", severity: "" });
    const [anchorEl, setAnchorEl] = useState(null);
    const [showLoading, setShowLoading] = useState(false);
    const [showAbout, setShowAbout] = useState(false);

    useEffect(() => {}, [idLanguage]);

    const fetchEstimations = async () => {
        try {
            console.log("API_URL: " + API_URL)
            console.log("TASK: " + task)
            const response = await fetch(
                `${API_URL}/API/chat?task=${encodeURIComponent(task)}&seniority=${encodeURIComponent(selectedSeniority)}&idLanguage=${encodeURIComponent(idLanguage)}`,                {
                    method: 'GET',
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("data:", data);
            console.log("task:", task);
            console.log("seniority:", selectedSeniority);
            return data;
        } catch (error) {
            console.error('Error fetching estimations:', error);
            throw error;
        }
    };

  handleEstimate = async () => {
        setShowEstimations(false);
        setShowCopy(false);
        setShowLoading(true);
        if (!task) {
            setToast({
                open: true,
                message: "Por favor, ingrese un objetivo antes de obtener la estimación.",
                severity: "warning",
            });
            setShowLoading(false);
        }
        if (!selectedSeniority) {
            setToast({
                open: true,
                message: "Por favor, ingrese el nivel de experiencia.",
                severity: "warning",
            });
            setShowLoading(false);
        }
        else {
            fetchEstimations()
                .then((data) => {
                    console.log("Estimations:", data);
                    if (data.smart) {
                        // Procesa y muestra las estimaciones si smart es true
                        const tasksString = data.estimation.tasks
                            .map((t) => `•\t${t.task} - Estimado: ${t.estimated_hours} horas`)
                            .join("\n");
                        setEstimations(
                            `${tasksString}\n\nTotal estimado: ${data.estimation.tasks.reduce(
                                (acc, curr) => acc + curr.estimated_hours,
                                0
                            )} horas`
                        );
                        setShowEstimations(true);
                        setShowCopy(true);
                    }
                    else {
                        const tasksString = data.estimation.tasks
                            .map((t, index) => (index === 0 ? `${t.task}` : `\t• ${t.task}`))
                            .join("\n");
                        setEstimations(tasksString);
                        setShowEstimations(true);
                        setShowCopy(false); // Controla la visibilidad del botón de copia
                    }
                    setID(data.id)
                })
                .catch((error) => {
                    setEstimations(`Error al obtener las estimaciones: ${error.message}`);
                    setShowEstimations(true);
                    setShowCopy(false); // Ocultar el botón de copia en caso de error
                })
                .finally(() => {
                    setShowLoading(false);
                });
        }
    }

    const handleLanguageChange = (selectedId) => {
        setIdLanguage(selectedId); // Actualiza el ID seleccionado
    };

    const handleClear = () => {
        setTask('');
        setShowCopy(false)
        setEstimations('')
        setShowEstimations(false)
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(estimations).then(() => {
              setToast({
                    open: true,
                    message: "Estimaciones copiadas al portapapeles",
                  severity: "success",
              });
        });
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const shareFacebook = () => {
        const shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(estimations)}`;
        window.open(shareURL, "_blank");
    };

    const shareGmail = () => {
        const subject = "Estimaciones"; // Asunto del correo electrónico
        const shareURL = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(estimations)}`;
        window.open(shareURL);
    };

    const shareWhatsApp = () => {
        const shareURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(estimations)}`;
        window.open(shareURL, "_blank");
    };

    const onChangeRating = async (event, newRating) => {
        setRatingValue(newRating);
        console.log(newRating);
        try {
            const response = await fetch(`${API_URL}/API/estimations/${id}`, {
                method: "POST",
                body: JSON.stringify({
                    stars: newRating,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setToast({
                open: true,
                message: "Gracias por evaluar las Estimaciones",
                severity: "success",
            });
        } catch (error) {
            console.error("Error fetching estimations:", error);
            throw error;
        }
    }

    return (
        <div>
            <ListadoIdiomas onLanguageChange={handleLanguageChange}/>
            <div className="container" style={{width: "100%", height: "10vh",}}>
                <img className="logo-menu" src={logotipo} alt={"Banner Enciso Estimation"}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '85vh', }}>
                <div style={{ padding: 16, maxWidth: 800, width: '100%' }}>
                    <Dialog open={showAbout} onClose={() => setShowAbout(false)} maxWidth="xl" fullWidth
                    PaperProps={{
                        style: {
                            backgroundColor: 'rgba(0, 0, 50, 0.95)' // Cambia el color de fondo aquí
                        }
                    }}>
                        <DialogContent>
                            <About />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setShowAbout(false)} style={{ color: 'white' }}>
                                Cerrar
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <TextField label="Ingrese su objetivo" value={task} onChange={(e) => setTask(e.target.value)} fullWidth margin="normal" autoComplete="off" inputProps={{style: {textAlign: 'center'}}} multiline rowsMax={10}
                        InputProps={{ endAdornment: (
                            <InputAdornment position="end">
                                <Button onClick={handleClear} edge="end">
                                    <DeleteIcon/>
                                </Button>
                            </InputAdornment>
                        )}}
                    />

                    <Select
                        value={selectedSeniority}
                        onChange={(e) => setSelectedSeniority(e.target.value)}
                        fullWidth
                        margin="normal"
                        label="Seleccione el nivel de seniority"
                    >
                        {seniorityLevels.map((level) => (
                            <MenuItem key={level} value={level}>
                                {level}
                            </MenuItem>
                        ))}
                    </Select>

                    <div>
                        {showLoading && <LinearProgress/>}
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', margin: '16px 0'}}>
                        <Button onClick={handleEstimate} variant="contained" color="primary"
                            sx={{
                                backgroundColor: "#0604A3",
                                "&:hover": {
                                    backgroundColor: "#940094",
                                },
                            }}
                        >
                            Estimar
                        </Button>
                    </div>

                    {showEstimations && (
                        <div>
                            <TextField label="Estimaciones" value={estimations} multiline fullWidth margin="normal" InputProps={{readOnly: true}} variant="outlined"/>
                            {showCopy && (
                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                    <div style={{display: 'flex', justifyContent: 'center', margin: '16px 0'}}>
                                        <IconButton onClick={copyToClipboard} aria-label="Copy">
                                            <ContentCopyIcon/>
                                        </IconButton>
                                    </div>

                                    <div style={{display: 'flex', justifyContent: 'center', margin: '16px 0'}}>
                                        <IconButton onClick={handleClick} aria-label="share">
                                            <ShareIcon/>
                                        </IconButton>
                                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                                            <MenuItem onClick={shareFacebook}>
                                                <Facebook style={{marginRight: '8px'}}/>
                                                Compartir en Facebook
                                            </MenuItem>
                                            <MenuItem onClick={shareWhatsApp}>
                                                <WhatsApp style={{marginRight: '8px'}}/>
                                                Compartir en WhatsApp
                                            </MenuItem>
                                            <MenuItem onClick={shareGmail}>
                                                <Email style={{marginRight: '8px'}}/>
                                                Enviar por Gmail
                                            </MenuItem>
                                        </Menu>
                                    </div>
                                    <div>
                                        <h3>Evalua las estimaciones</h3>
                                        <Rating name="rating" value={ratingValue} onChange={onChangeRating}/>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <Toast open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast({ ...toast, open: false })} />
                </div>
            </div>
        </div>
    );
}
