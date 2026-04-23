document.getElementById("appointmentForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = e.target;

    const selectedDate = form.date.value;
    const selectedTime = form.time.value;

    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const currentDateTime = new Date();

    // Prevent past booking
    if(selectedDateTime <= currentDateTime){
        document.getElementById("message").innerText =
            "❌ Please select a future date and time.";
        return;
    }

    const data = {
        ownerName: form.ownerName.value,
        petName: form.petName.value,
        petType: form.petType.value,
        date: selectedDate,
        time: selectedTime,
        service: form.service.value
    };

    try {
        const response = await fetch("http://localhost:5000/appointment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.text();
        document.getElementById("message").innerText = result;

        if(response.ok){
            form.reset();
        }

    } catch(error){
        document.getElementById("message").innerText =
            "❌ Error connecting to server";
    }
});