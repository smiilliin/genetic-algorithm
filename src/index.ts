class Gene extends Uint8Array {
  /**
   * get a bit
   * @param x bit index
   * @returns returns a bit or undefined
   */
  get(x: number): number | undefined {
    const byteIndex = Math.floor(x / 8);
    const bitIndex = x % 8;
    const byte = this.at(byteIndex);

    if (byte != undefined) {
      return (byte & (1 << (7 - bitIndex))) == 0 ? 0 : 1;
    }
    return undefined;
  }
  /**
   * edit a bit
   * @param x bit index
   * @param data bit data
   * @returns returns whether byte is exist
   */
  edit(x: number, data: number): boolean {
    const byteIndex = Math.floor(x / 8);
    const bitIndex = x % 8;
    const byte = this.at(byteIndex);

    if (byte != undefined) {
      if (data) {
        this[byteIndex] |= 1 << (7 - bitIndex);
      } else {
        this[byteIndex] &= ~(1 << (7 - bitIndex));
      }
      return true;
    }
    return false;
  }
  /**
   * get random bits
   */
  mix() {
    for (let i = 0; i < this.byteLength; i++) {
      let byte = 0;

      for (let j = 0; j < 8; j++) {
        byte |= Math.random() < 0.5 ? 1 : 0;
        byte <<= 1;
      }

      this[i] = byte;
    }
  }
  /**
   * convert to number
   * @param length bit length
   * @returns number
   */
  toNumber(length: number): number {
    const byteLength = Math.floor((length - 1) / 8) + 1;
    const bitIndex = (length - 1) % 8;
    let result = 0;

    for (let i = 0; i < byteLength - 1; i++) {
      result <<= 8;
      result |= this[i];
    }
    result <<= bitIndex + 1;
    result |= this[byteLength - 1] >> (7 - bitIndex);

    return result;
  }
  /**
   * get binary string
   * @param length
   * @returns binary string
   */
  getBinary(length: number): string {
    return ("0".repeat(length) + this.toNumber(length).toString(2)).slice(
      -length
    );
  }
}
type ScoreFunction = (gene: Gene) => number;
class GeneticCore {
  bitSize: number;
  geneCount: number;
  tempGeneCount: number;
  genes: Gene[];
  tempGenes: Gene[];
  mutationP: number;

  /**
   * construct GeneticCore
   * @param bitSize gene bit size
   * @param geneCount gene count
   * @param tempGeneCount temporary gene count
   * @param mutationP mutation probability
   */
  constructor(
    bitSize: number,
    geneCount: number,
    tempGeneCount: number,
    mutationP: number
  ) {
    if (tempGeneCount > geneCount) {
      throw new Error("tempGeneCount is bigger than geneCount");
    }

    this.genes = [];
    this.tempGenes = [];
    for (let i = 0; i < geneCount; i++) {
      const gene = new Gene(Math.floor((bitSize - 1) / 8) + 1);
      gene.mix();
      this.genes.push(gene);
    }
    this.bitSize = bitSize;
    this.geneCount = geneCount;
    this.tempGeneCount = tempGeneCount;
    this.mutationP = mutationP;
  }
  /**
   * reset all genes
   */
  reset() {
    this.genes.splice(0);

    for (let i = 0; i < this.geneCount; i++) {
      const gene = new Gene(Math.floor((this.bitSize - 1) / 8) + 1);
      gene.mix();
      this.genes.push(gene);
    }
  }
  /**
   * step one generation
   * @param f score function
   */
  stepGeneration(f: ScoreFunction) {
    this.tempGenes.splice(0);
    this.selection(f);
    this.crossover();
    this.mutation();
  }
  /**
   * get current gene
   * @param f score function
   * @returns [gene, score]
   */
  get(f: ScoreFunction): [Gene, number] {
    let maxScore = Number.MIN_SAFE_INTEGER;
    let maxGene: Gene = new Gene();

    this.genes.forEach((gene) => {
      const score = f(gene);
      if (score > maxScore) {
        maxScore = score;
        maxGene = gene;
      }
    });
    return [maxGene, maxScore];
  }
  private selection(f: ScoreFunction) {
    const scores = this.genes.map((gene) => f(gene));
    const genesCopy = [...this.genes];

    const pick = () => {
      let random = Math.random();
      let sum = scores.reduce((prev, curr) => prev + curr, 0);

      if (sum == 0) throw new Error("score sum is zero");

      let result = -1;

      for (let i = 0; i < scores.length; i++) {
        const score = scores[i];
        random -= score / sum;

        if (random < 0) result = i;
      }
      if ((result = -1)) result = scores.length - 1;

      return result;
    };

    for (let i = 0; i < this.tempGeneCount; i++) {
      const pickIndex = pick();

      this.tempGenes.push(this.genes[pickIndex]);

      genesCopy.splice(pickIndex, 1);
      scores.splice(pickIndex, 1);
    }
  }
  private crossover() {
    this.genes.splice(0);

    for (let i = 0; i < this.geneCount; i++) {
      const a =
        this.tempGenes[Math.floor(this.tempGenes.length * Math.random())];
      const b =
        this.tempGenes[Math.floor(this.tempGenes.length * Math.random())];
      const newGene = new Gene(Math.floor((this.bitSize - 1) / 8) + 1);

      for (let j = 0; j < this.bitSize; j++) {
        const data = Math.random() < 0.5 ? a.get(j) : b.get(j);
        newGene.edit(j, data || 0);
      }
      this.genes.push(newGene);
    }
  }
  private mutation() {
    this.genes.forEach((gene) => {
      if (Math.random() < this.mutationP) {
        const i = Math.floor(this.bitSize * Math.random());
        if (gene.get(i)) {
          gene.edit(i, 0);
        } else {
          gene.edit(i, 1);
        }
      }
    });
  }
}

export { Gene, GeneticCore, ScoreFunction };
