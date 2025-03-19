# Mind Duplication
For my third project I had to choose a dataset to process. I choose the last competitive game of Gary Kasparov, a famous chess player.

## How to run
There is probably more than one way to run this but I personnaly use the Live Server extensions from VSCode to execute it on my web browser. Best result might be on Chrome or Opera since that's the two web browsers I used during development. Don't hesitate to activate the fullscreen mode of your web browser (F11) then refresh (F5) for better experience.
A new generation of the art is drawn at each refresh (F5).

## How does it work 
The page is divided in several square. Each of this squares represent the chess board of a random game of Kasparov. In each chess board, every pieces are remplaces by their "area of influence". 
For example, the bishop have 4 movement direction, for each of this dirrection the first obstacles (piece of board's end) is detected, returning 4 points of obstacles. Then an area is draw to join all of this point. Finally the area is colored in a random shade of orange for white pieces and mauve for black pieces, moreover the transparency is also random. 
The only exception is the king, represented as a turquoise square for both player, and knigth represented with a circle for each of their possible movement, obstacles or not.
At each frame, boards are rotating randomly and some of them play the next move of the game.

## Demonstrations
Videos of my work are available in the demonstrations folder. Meanwhile let me show you some screenshot of it :

<img src="https://u.cubeupload.com/Albert09/ezgif2f3658b512cfd4.png" width="500" />
