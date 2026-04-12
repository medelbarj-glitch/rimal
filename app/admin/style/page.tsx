import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { AdminLayout } from '@/app/admin/components/AdminLayout';
import { StyleModal } from './StyleModal';
import { ServiceModal } from './ServiceModal';
import { createBackgroundImage, deleteBackgroundImage } from '@/app/actions/style';
import { createService, deleteService } from '../services/actions';
import { createExperience, deleteExperience } from '../experience/actions';
import { ExperienceModal } from './ExperienceModal';
import { ImageFileInput } from '../components/ImageFileInput';
import './style.css';

const prisma = new PrismaClient();

export default async function StylePage() {
    const images = await prisma.backgroundImage.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    // Load Services from JSON
    const servicesPath = path.join(process.cwd(), 'data', 'services.json');
    let services = [];
    try {
        const data = await fs.readFile(servicesPath, 'utf-8');
        services = JSON.parse(data);
    } catch (e) {
        services = [];
    }

    // Load Experience from DB
    const experiences = await prisma.experience.findMany({
        orderBy: { createdAt: 'asc' }
    });

    return (
        <AdminLayout title="Gestion du Style et Contenu">
            <div className="data-grid">

                {/* --- BACKGROUNDS SECTION --- */}
                <h2 className="style-page-title" style={{ marginBottom: '2rem' }}>
                    Images d'arrière-plan ({images.length})
                </h2>

                <div className="services-split">
                    {/* ADD FORM */}
                    <div className="service-form">
                        <h3 style={{ marginBottom: '1rem' }}>Ajouter une image</h3>
                        <form action={createBackgroundImage} encType="multipart/form-data">
                            <div className="form-group">
                                <label>Nom Interne (Admin)</label>
                                <input type="text" name="name" placeholder="Ex: Slider Accueil 1" required />
                            </div>
                            <div className="form-group">
                                <label>Titre (Affiché - FR)</label>
                                <input type="text" name="title" placeholder="Ex: Service premium" />
                            </div>
                            <div className="form-group">
                                <label>Titre (Affiché - EN)</label>
                                <input type="text" name="title_en" />
                            </div>
                            <div className="form-group">
                                <label>Titre (Affiché - ES)</label>
                                <input type="text" name="title_es" />
                            </div>
                            <div className="form-group">
                                <label>Titre (Affiché - AR)</label>
                                <input type="text" name="title_ar" dir="rtl" />
                            </div>
                            <div className="form-group">
                                <label>Titre (Affiché - MA)</label>
                                <input type="text" name="title_ma" dir="rtl" />
                            </div>
                            <div className="form-group">
                                <label>Sous-titre (Affiché - FR)</label>
                                <input type="text" name="subtitle" placeholder="Ex: Location de voitures de luxe" />
                            </div>
                            <div className="form-group">
                                <label>Sous-titre (Affiché - EN)</label>
                                <input type="text" name="subtitle_en" />
                            </div>
                            <div className="form-group">
                                <label>Sous-titre (Affiché - ES)</label>
                                <input type="text" name="subtitle_es" />
                            </div>
                            <div className="form-group">
                                <label>Sous-titre (Affiché - AR)</label>
                                <input type="text" name="subtitle_ar" dir="rtl" />
                            </div>
                            <div className="form-group">
                                <label>Sous-titre (Affiché - MA)</label>
                                <input type="text" name="subtitle_ma" dir="rtl" />
                            </div>
                            <div className="form-group">
                                <label>Image d'arrière-plan</label>
                                <ImageFileInput
                                    name="imageFile"
                                    accept="image/png, image/jpeg, image/webp"
                                    required
                                />
                                <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                                    Formats recommandés : JPG, PNG ou WEBP
                                </small>
                            </div>
                            <button type="submit" className="btn-submit">Ajouter</button>
                        </form>
                    </div>

                    {/* LIST */}
                    <div className="service-list">
                        {images.map((img) => (
                            <div key={img.id} className="style-card" style={{ position: 'relative' }}>
                                <div className="service-card-actions">
                                    <StyleModal
                                        image={img}
                                        trigger={
                                            <button className="btn-icon" title="Modifier">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        }
                                    />
                                    <form action={deleteBackgroundImage.bind(null, img.id)}>
                                        <button className="btn-icon delete" title="Supprimer" type="submit">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </div>

                                <div className="style-card-image-container">
                                    <img
                                        src={img.url}
                                        alt={img.name}
                                        className="style-card-image"
                                    />
                                </div>

                                <div className="style-card-content">
                                    <h3 className="style-card-title">{img.name}</h3>
                                    {img.title && <p className="style-card-text"><strong>Titre:</strong> {img.title}</p>}
                                    {img.subtitle && <p className="style-card-text"><strong>Sous-titre:</strong> {img.subtitle}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <hr style={{ margin: '4rem 0', borderTop: '1px solid #ddd' }} />

                {/* --- SERVICES SECTION --- */}
                <h2 className="style-page-title" style={{ marginBottom: '2rem' }}>
                    Services Exclusifs (Page d'accueil)
                </h2>

                <div className="services-split">
                    {/* ADD FORM */}
                    <div className="service-form">
                        <h3 style={{ marginBottom: '1rem' }}>Ajouter un Service</h3>
                        <form action={createService} encType="multipart/form-data">
                            <div className="form-group">
                                <label>Titre (FR)</label>
                                <input type="text" name="title" placeholder="Ex: Kilométrage Illimité" required />
                            </div>
                            <div className="form-group">
                                <label>Titre (EN)</label>
                                <input type="text" name="title_en" placeholder="Ex: Unlimited Mileage" />
                            </div>
                            <div className="form-group">
                                <label>Titre (ES)</label>
                                <input type="text" name="title_es" />
                            </div>
                            <div className="form-group">
                                <label>Titre (AR)</label>
                                <input type="text" name="title_ar" dir="rtl" />
                            </div>
                            <div className="form-group">
                                <label>Titre (MA)</label>
                                <input type="text" name="title_ma" dir="rtl" />
                            </div>
                            <div className="form-group">
                                <label>Icône (FontAwesome)</label>
                                <input type="text" name="icon" placeholder="Ex: fa-road" required />
                                <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                                    Utilisez des classes <a href="https://fontawesome.com/icons" target="_blank" style={{ textDecoration: 'underline' }}>FontAwesome</a> (ex: fa-wifi, fa-car)
                                </small>
                            </div>
                            <div className="form-group">
                                <label>Description (FR)</label>
                                <textarea name="description" rows={3} placeholder="Description courte..." required></textarea>
                            </div>
                            <div className="form-group">
                                <label>Description (EN)</label>
                                <textarea name="description_en" rows={3} placeholder="Short description..."></textarea>
                            </div>
                            <div className="form-group">
                                <label>Description (ES)</label>
                                <textarea name="description_es" rows={3}></textarea>
                            </div>
                            <div className="form-group">
                                <label>Description (AR)</label>
                                <textarea name="description_ar" rows={3} dir="rtl"></textarea>
                            </div>
                            <div className="form-group">
                                <label>Description (MA)</label>
                                <textarea name="description_ma" rows={3} dir="rtl"></textarea>
                            </div>
                            <button type="submit" className="btn-submit">Ajouter</button>
                        </form>
                    </div>

                    {/* LIST */}
                    <div className="service-list">
                        {services.map((svc: any) => (
                            <div key={svc.id} className="service-card">
                                <div className="service-card-actions">
                                    <ServiceModal
                                        service={svc}
                                        trigger={
                                            <button className="btn-icon" title="Modifier">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        }
                                    />
                                    <form action={deleteService.bind(null, svc.id)}>
                                        <button className="btn-icon delete" title="Supprimer" type="submit">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </div>
                                <div style={{ textAlign: 'center', margin: '2rem 0 1rem 0' }}>
                                    <i className={`fas ${svc.icon} icon-preview`}></i>
                                </div>
                                <h4 style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{svc.title}</h4>
                                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>{svc.description}</p>
                            </div>
                        ))}
                        {services.length === 0 && <p>Aucun service configuré.</p>}
                    </div>
                </div>

                <hr style={{ margin: '4rem 0', borderTop: '1px solid #ddd' }} />

                {/* --- EXPERIENCE SECTION --- */}
                <h2 className="style-page-title" style={{ marginBottom: '2rem' }}>
                    Expérience Section (Page d'accueil)
                </h2>

                <div className="services-split">
                    {/* ADD FORM */}
                    <div className="service-form">
                        <h3 style={{ marginBottom: '1rem' }}>Ajouter une Expérience</h3>
                        <form action={createExperience} encType="multipart/form-data">
                            <div className="form-group">
                                <label>Titre (FR)</label>
                                <input type="text" name="title" placeholder="Ex: L'Excellence..." required />
                            </div>
                            <div className="form-group">
                                <label>Titre (EN)</label>
                                <input type="text" name="title_en" />
                            </div>
                            <div className="form-group">
                                <label>Titre (ES)</label>
                                <input type="text" name="title_es" />
                            </div>
                            <div className="form-group">
                                <label>Titre (AR)</label>
                                <input type="text" name="title_ar" dir="rtl" />
                            </div>
                            <div className="form-group">
                                <label>Titre (MA)</label>
                                <input type="text" name="title_ma" dir="rtl" />
                            </div>
                            <div className="form-group">
                                <label>Description (FR)</label>
                                <textarea name="description" rows={3} placeholder="Description..." required></textarea>
                            </div>
                            <div className="form-group">
                                <label>Description (EN)</label>
                                <textarea name="description_en" rows={3}></textarea>
                            </div>
                            <div className="form-group">
                                <label>Description (ES)</label>
                                <textarea name="description_es" rows={3}></textarea>
                            </div>
                            <div className="form-group">
                                <label>Description (AR)</label>
                                <textarea name="description_ar" rows={3} dir="rtl"></textarea>
                            </div>
                            <div className="form-group">
                                <label>Description (MA)</label>
                                <textarea name="description_ma" rows={3} dir="rtl"></textarea>
                            </div>
                            <div className="form-group">
                                <label>Image (Upload)</label>
                                <ImageFileInput name="imageFile" accept="image/png, image/jpeg, image/webp" required />
                            </div>
                            <div className="form-group">
                                <label>Texte Bouton (FR)</label>
                                <input type="text" name="buttonText" placeholder="Ex: Découvrir..." />
                            </div>
                            <div className="form-group">
                                <label>Texte Bouton (EN)</label>
                                <input type="text" name="buttonText_en" />
                            </div>
                            <div className="form-group">
                                <label>Texte Bouton (ES)</label>
                                <input type="text" name="buttonText_es" />
                            </div>
                            <div className="form-group">
                                <label>Texte Bouton (AR)</label>
                                <input type="text" name="buttonText_ar" dir="rtl" />
                            </div>
                            <div className="form-group">
                                <label>Texte Bouton (MA)</label>
                                <input type="text" name="buttonText_ma" dir="rtl" />
                            </div>
                            <button type="submit" className="btn-submit">Ajouter</button>
                        </form>
                    </div>

                    {/* LIST */}
                    <div className="service-list">
                        {experiences.map((exp: any) => (
                            <div key={exp.id} className="style-card" style={{ position: 'relative' }}>
                                <div className="service-card-actions">
                                    <ExperienceModal
                                        item={exp}
                                        trigger={
                                            <button className="btn-icon" title="Modifier">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        }
                                    />
                                    <form action={deleteExperience.bind(null, exp.id)}>
                                        <button className="btn-icon delete" title="Supprimer" type="submit">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </div>

                                <div className="style-card-image-container">
                                    <img
                                        src={exp.imageUrl}
                                        alt={exp.title}
                                        className="style-card-image"
                                    />
                                </div>

                                <div className="style-card-content">
                                    <h3 className="style-card-title">{exp.title}</h3>
                                    <p className="style-card-text" style={{ whiteSpace: 'pre-line' }}>{exp.description.substring(0, 100)}...</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
