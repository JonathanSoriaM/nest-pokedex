import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const newPokemon = await this.pokemonModel.create(createPokemonDto);
      return newPokemon;
    } catch (error) {
      this.handleException(error);
    }

    
  }

  async findAll() {
    const pokemons = await this.pokemonModel.find();
    return pokemons;
  }

  async findOne(id: string) {
    
    let pokemon : Pokemon;

    if(!isNaN(+id)){
      pokemon = await this.pokemonModel.findOne( { no: id });
    }

    // verificacion por MongoId
    if( !pokemon && isValidObjectId(id) ){
      pokemon = await this.pokemonModel.findById(id);
    }
    // verificacion por name
    if( !pokemon  ){
      pokemon = await this.pokemonModel.findOne({name: id.toLowerCase()})
    }
    // retornar repuesta si el campo a buscar no existe 

    if(!pokemon) throw new NotFoundException (`Pokemon with id , name or no ${id} not found`)


    return pokemon
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
   
    const pokemon = await this.findOne(id);

    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      const updatePokemon = await pokemon.updateOne(updatePokemonDto, { new:true})
      return updatePokemon;

    } catch (error) {
     this.handleException(error);
    }
  

    if(!pokemon) throw new NotFoundException (`Pokemon with id , name or no ${id} not found`)

    
   
  }

  async remove(id: string) {

    /*este metodo se aplicaria si no se tuviera que valirdar la fomra de eliminacion fuera 
    fuera por un MongoId
    */
    //const pokemon = await this.findOne(id);
    //await pokemon.deleteOne();
    //return {id};
    //const result = await this.pokemonModel.findByIdAndDelete(id);
    const {deletedCount} = await this.pokemonModel.deleteOne({_id : id});

    if(deletedCount === 0 )
      throw new BadRequestException(`Pokemon with id : ${id} not found`);
    return;
  }


  private handleException (error :any){
    if(error.code === 11000) {
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}` )
     }
     console.log(error)
     throw new InternalServerErrorException(`Can't create Pokemon - Chek server logs`)
  }
}
