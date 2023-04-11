const gridSlots = document.getElementsByClassName("GridSlot");


window.onload = () =>{
    for (let i = 0; i < gridSlots.length; i++)
    {
        gridSlots[i].addEventListener("click", onGridSlotClick);
    }

}

function onGridSlotClick(slot) {
    console.log(slot.target.id);

    slot.target = "X"
}