import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  async create(@Res() res, @Body() createPokemonDto: CreatePokemonDto) {
    
    const newPokemon = await this.pokemonService.create(createPokemonDto);

   return res.status (HttpStatus.CREATED).json({
    message: 'Pokemon Created',
    pokemon : newPokemon
   })
    // forma mas rapida de retornar el resultado sin especificar la respuesta
    // return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
   // return this.pokemonService.update(id, updatePokemonDto);
    const updatePokemon = await this.pokemonService.update(id, updatePokemonDto);

    return updatePokemon;

  }

  @Delete(':id')
  remove(@Param('id' , ParseMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
