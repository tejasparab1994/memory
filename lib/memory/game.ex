defmodule Memory.Game do
  def new do
    beginGame = ["A", "B", "C", "D", "E", "F", "G", "H", "A", "B", "C", "D", "E", "F", "G", "H"]

    %{
      squares: Enum.shuffle(beginGame),
      currentSquare: List.duplicate(nil, 16),
      prevSquare: %{id: nil, value: nil},
      flipped: true,
      count: 0,
      prevSquareid: nil,
      locked: false,
      matches: 0
    }
  end

  # retuns the game to the client side
  # here we do not return the squares array because we aren't using
  # the values of squares anywhere in the client side
  def client_view(game) do
    squares = game.squares
    # IO.inspect squares
    currentSquare = game.currentSquare
    # IO.inspect currentSquare
    # prevSquare = game.prevSquare
    locked = game.locked
    # return the updated game to the client side(react)
    %{
      currentSquare: currentSquare,
      flipped: game.flipped,
      count: game.count,
      locked: locked,
      prevSquareid: game.prevSquareid,
      matches: game.matches
    }
  end

  # Returns the updated game
  # convert the react logic of checkMatch to elixir, keep most stuff same
  def checkMatch(game, id, currentSquare, flipped, count, locked, matches) do
    sqvalue = Enum.at(game.squares, id)
    # IO.inspect sqvalue
    # IO.inspect("flipped")
    # IO.inspect(flipped)
    # to avoid clicking on a third square when two already selected
    if !locked do
      # last time I used to manipulate the flipped status of each square through
      # the list of maps I had but this time had to come up with a global state of
      # flipped and create a local copy to manipulate each square
      local_flip = flipped
      # get tuple value
      # get the value of the previous square clicked, null if first square being clicked
      prevSquareval = game.prevSquare.value
      # empty square clicked
      # to check the value of currentsquare, whether nil or new value given to that id
      # if value present, then the square was previously clicked
      if Enum.at(currentSquare, id) == nil do
        # increase the click count i.e. the score
        count = count + 1
        # replace the currentsquare value of nil with the sqvalue at the id
        currentSquare = List.replace_at(currentSquare, id, sqvalue)
        # change the flipped variable to true for the square
        # not globally, since maintaining the state for other squares
        local_flip = !flipped

        # IO.inspect(local_flip)
        # second square if this true
        # now we check if the values match for both squares clicked
        if local_flip do
          if prevSquareval == sqvalue do
            # IO.inspect "elements match prevSquareval"
            # IO.inspect prevSquareval
            # since values match, we update the match variable
            matches = matches + 1
            # since two squares have been clicked, setting the lock as true
            # in order to avoid clicking any more squares
            locked = true
            # changing the id of previous Square clicked and sending it to client side
            prevSquareid = game.prevSquare.id
            # updating the prevSquare tuple in the game with new id and value
            game = put_in(game, [:prevSquare, :id], id)
            game = put_in(game, [:prevSquare, :value], sqvalue)
            prevSquare = game.prevSquare
            # returning the updated game values
            %{
              squares: game.squares,
              currentSquare: currentSquare,
              prevSquare: prevSquare,
              flipped: local_flip,
              count: count,
              prevSquareid: prevSquareid,
              locked: locked,
              matches: matches
            }

            # elements dont match
          else
            # IO.inspect "elements dont match"
            # locked since two tiles have been clicked
            locked = true
            prevSquareid = game.prevSquare.id
            # value = Enum.at(game.squares, id)
            game = put_in(game, [:prevSquare, :id], id)
            game = put_in(game, [:prevSquare, :value], sqvalue)
            prevSquare = game.prevSquare
            # returning the updated game values
            %{
              squares: game.squares,
              currentSquare: currentSquare,
              prevSquare: prevSquare,
              flipped: local_flip,
              count: count,
              prevSquareid: prevSquareid,
              locked: locked,
              matches: matches
            }
          end

          # first square clicked
          # here we just need to update the prev square and current square vals
          # no need to set lock to true
        else
          # IO.inspect "here?"
          currentSquare = List.replace_at(currentSquare, id, sqvalue)
          prevSquareid = game.prevSquare.id
          # value = Enum.at(game.squares, id)
          game = put_in(game, [:prevSquare, :id], id)
          game = put_in(game, [:prevSquare, :value], sqvalue)
          prevSquare = game.prevSquare
          # returning the updated game values

          %{
            squares: game.squares,
            currentSquare: currentSquare,
            prevSquare: prevSquare,
            flipped: local_flip,
            count: count,
            prevSquareid: prevSquareid,
            locked: locked,
            matches: matches
          }
        end
      end
    end
  end

  def handleto(game, currentSquare, prevSquareid) do
    value = game.prevSquare.value
    # unable to get the third color(green) for matched squares from HW03
    # so change the value of matched squares
    local = nil
    if Enum.at(game.squares, prevSquareid) == value do
      val = "$"

      local = List.replace_at(currentSquare, game.prevSquare.id, val) |> List.replace_at(prevSquareid, val)

      # else if the two squares don't match, set their values
      # back to nil
    else
      local =
        List.replace_at(currentSquare, game.prevSquare.id, nil)
        |> List.replace_at(prevSquareid, nil)
    end

    # return the updated game values
    %{
      squares: game.squares,
      currentSquare: local,
      prevSquare: game.prevSquare,
      flipped: game.flipped,
      count: game.count,
      prevSquareid: game.prevSquareid,
      locked: false,
      matches: game.matches
    }
  end
end
