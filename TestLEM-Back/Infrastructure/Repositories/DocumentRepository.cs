using Domain.Abstraction;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class DocumentRepository : IDocumentRepository
    {
        private readonly LemDbContext _dbContext;

        public DocumentRepository(LemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public int AddDocument(Document document)
        {
            _dbContext.Documents.Add(document);
            _dbContext.SaveChanges();

            return document.Id;
        }

        public async Task<ICollection<string>> AddDocumentsAsync(ICollection<Document> documents, int? modelId, int? deviceId)
        {
            var documentNames = new List<string>();

            foreach (var document in documents)
            {
                documentNames.Add(document.Name);
                document.ModelId = modelId;
                document.DeviceId = deviceId;
            }

            await _dbContext.Documents.AddRangeAsync(documents);
            await _dbContext.SaveChangesAsync();

            return documentNames;
        }

        public Task<Document> GetFileByModelId(int modelId)
        {
            return _dbContext.Documents.FirstAsync(x => x.ModelId == modelId);
        }

        public Task<List<Document>> GetDocumentsByName(string documentName)
        {
            return _dbContext.Documents.Where(x => x.Name  == documentName).ToListAsync();
        }
    }
}
