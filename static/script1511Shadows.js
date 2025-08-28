const canvas = document.getElementById('map');
const ctx = canvas.getContext("2d")
const width = canvas.width;
const height = canvas.height;

const box_amount = 10;

const box_height = height / box_amount;
const box_width = width / box_amount;

create_map();

function create_map() {
    ctx.fillStyle = "rgb(0 0 0)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgb(211 211 211)";

    for (i = 0; i < box_amount; i++) {
        for (j = 0; j < box_amount; j++) {
            ctx.fillRect(box_width * i + 1, box_height * j + 1, box_width - 2, box_height - 2);
        }
    }
    create_labels()

}

function create_labels() {
        // Add labels
        ctx.fillStyle = "black";
        ctx.font = "16px Arial"; // Font size and type
    
        // Top row numbers (column labels)
        for (let i = 0; i < box_amount; i++) {
            ctx.fillText(i, box_width * i + box_width / 2 - 5, 15);
        }
    
        // Left column numbers (row labels)
        for (let j = 0; j < box_amount; j++) {
            ctx.fillText(j, 5, box_height * j + box_height / 2 + 5);
        }
}

document.getElementById('submit').addEventListener('click', makeLine)

function makeLine() {
    event.preventDefault();
    create_map();
    player_row = document.getElementById('player-row').value;
    player_col = document.getElementById('player-col').value;
    block_row = document.getElementById('block-row').value;
    block_col = document.getElementById('block-col').value;

    ctx.fillStyle = "rgb(240, 166, 113)" // Orange for player
    ctx.fillRect(player_col * box_height + 1, player_row * box_width + 1,  box_width - 2, box_height - 2)

    ctx.fillStyle = "rgb(106, 238, 253)" // Blue for block
    ctx.fillRect(block_col * box_height + 1, block_row * box_width + 1, box_width - 2, box_height - 2)

    ctx.strokeStyle = "green";

    ctx.beginPath();

    ctx.moveTo(block_col * box_height + box_height / 2, block_row * box_width + box_width / 2);

    ctx.lineTo(player_col * box_height + box_height / 2, player_row * box_width + box_width / 2);

    ctx.lineWidth = 3;

    // Stroke it (Do the Drawing)
    ctx.stroke();
    create_labels()
}
