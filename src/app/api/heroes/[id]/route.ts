import { NextRequest, NextResponse } from 'next/server';
import { db, getHeroById, getHeroAwards, addHeroAwards } from '@/lib/mockDb';
import { Hero } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Получаем героя из БД
    const hero = await getHeroById(id);
    
    if (!hero) {
      return NextResponse.json(
        { error: 'Герой не найден' },
        { status: 404 }
      );
    }
    
    // Получаем награды для героя
    const awards = await getHeroAwards(id);
    
    // Объединяем данные
    const heroWithAwards: Hero = {
      ...hero,
      awards: awards || []
    };
    
    return NextResponse.json(heroWithAwards);
  } catch (error) {
    console.error(`Ошибка при получении героя с ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении данных о герое' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const heroData = await request.json();
    
    // Проверяем существование героя
    const existingHero = await getHeroById(id);
    
    if (!existingHero) {
      return NextResponse.json(
        { error: 'Герой не найден' },
        { status: 404 }
      );
    }
    
    // Обновляем данные героя
    const updateQuery = `
      UPDATE heroes
      SET 
        name = ?,
        rank = ?,
        region = ?,
        description = ?,
        years = ?,
        photo = ?
      WHERE id = ?
      RETURNING *
    `;
    
    const result = await db.query(updateQuery, [
      heroData.name || existingHero.name,
      heroData.rank || existingHero.rank,
      heroData.region || existingHero.region,
      heroData.description || existingHero.description,
      heroData.years || existingHero.years,
      heroData.photo || existingHero.photo,
      id
    ]);
    
    const updatedHero = result.rows[0];
    
    // Если переданы награды, обновляем их
    if (heroData.awards && Array.isArray(heroData.awards)) {
      // Удаляем существующие награды
      await db.query('DELETE FROM hero_awards WHERE hero_id = ?', [id]);
      
      // Добавляем новые
      if (heroData.awards.length > 0) {
        await addHeroAwards(id, heroData.awards);
      }
    }
    
    // Получаем актуальный список наград
    const awards = await getHeroAwards(id);
    
    // Объединяем данные
    const heroWithAwards: Hero = {
      ...updatedHero,
      awards: awards || []
    };
    
    return NextResponse.json(heroWithAwards);
  } catch (error) {
    console.error(`Ошибка при обновлении героя с ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обновлении данных о герое' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Проверяем существование героя
    const existingHero = await getHeroById(id);
    
    if (!existingHero) {
      return NextResponse.json(
        { error: 'Герой не найден' },
        { status: 404 }
      );
    }
    
    // Удаляем награды героя
    await db.query('DELETE FROM hero_awards WHERE hero_id = ?', [id]);
    
    // Удаляем героя
    await db.query('DELETE FROM heroes WHERE id = ?', [id]);
    
    return NextResponse.json(
      { message: 'Герой успешно удален' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Ошибка при удалении героя с ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Произошла ошибка при удалении героя' },
      { status: 500 }
    );
  }
} 